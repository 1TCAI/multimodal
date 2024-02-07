"""
The main runtime file
"""

from __future__ import print_function
import tensorflow as tf
from eegnet.eegnet_v1 import eegnet_v1 as network
from eegnet.eegnet_v1 import get_init_fn
from eegnet.read_preproc_dataset import read_dataset
slim = tf.contrib.slim


##
# Directories
##
tf.app.flags.DEFINE_string('dataset_dir', '/content/dataset/eval/*.tfr',
                           'Where dataset TFReaders files are loaded from.')

tf.app.flags.DEFINE_string('checkpoint_dir', '/content/checkpoints',
                           'Where checkpoints are loaded from.')

tf.app.flags.DEFINE_string('log_dir', '/content/logs',
                           'Where checkpoints and event logs are written to.')

##
# Train configuration
##
tf.app.flags.DEFINE_boolean('is_training', False,
                            'Determines shuffling, dropout/batch_norm behaviour and removal.')

FLAGS = tf.app.flags.FLAGS


def main(_):
    """Generates the TF graphs and loads the NN"""
    tf.logging.set_verbosity(tf.logging.INFO)
    with tf.Graph().as_default() as graph:
        # Input pipeline
        filenames = tf.gfile.Glob(FLAGS.dataset_dir)
        data, labels = read_dataset(filenames,
                                    num_splits=1,
                                    batch_size=1,
                                    is_training=FLAGS.is_training)

        shape = data.get_shape().as_list()
        tf.logging.info('Batch size/num_points: %d/%d', shape[0], shape[2])

        # Create model
        logits, predictions = network(data, is_training=FLAGS.is_training)
        tf.logging.info('Network model created.')

        # Loss
        slim.losses.softmax_cross_entropy(logits, labels, scope='loss')

        # Sliced predictions and labels for AUC calculation: get last column only
        predictions = tf.slice(predictions, [0, 1], [-1, 1])
        labels = tf.slice(labels, [0, 1], [-1, 1])

        # Define the metrics:
        names_to_values, names_to_updates = slim.metrics.aggregate_metric_map({
            'stream_auc': slim.metrics.streaming_auc(predictions, labels),
            'stream_loss': slim.metrics.streaming_mean(slim.losses.get_total_loss()),
            })

        # Print the summaries to screen.
        for name, value in names_to_values.iteritems():
            summary_name = 'eval/%s' % name
            tf.summary.scalar(summary_name, value)

        # This ensures that we make a single pass over all of the data.
        num_batches = len(filenames)//1.0

        #
        # Evaluate
        #
        # TODO(nsilva): saver=USE_DEFAULT and managed_session() will load from checkpoint in 'logdir' instead of 'init_fn'!
        #               This is solved in test.py by save=None but if done here then no summaries will be written.
        supervi = tf.train.Supervisor(graph=graph,
                                      logdir=FLAGS.log_dir,
                                      summary_op=tf.merge_all_summaries(),
                                      summary_writer=tf.train.SummaryWriter(FLAGS.log_dir),
                                      save_summaries_secs=5,
                                      global_step=slim.get_or_create_global_step(),
                                      init_fn=get_init_fn(FLAGS.checkpoint_dir)) # restores from checkpoint

        with supervi.managed_session(master='', start_standard_services=False) as sess:
            tf.logging.info('Starting evaluation.')
            # Start queues for TFRecords reading
            supervi.start_queue_runners(sess)

            for i in range(int(num_batches)):
                tf.logging.info('Executing eval_op %d/%d', i + 1, num_batches)
                metric_values = sess.run(names_to_updates.values())

                output = dict(zip(names_to_values.keys(), metric_values))
                for name in output:
                    tf.logging.info('%s: %f', name, output[name])


if __name__ == '__main__':
    tf.app.run()

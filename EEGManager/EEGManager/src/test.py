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
tf.app.flags.DEFINE_string('dataset_dir', '/content/dataset/test/*.tfr',
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


def save_submit(grades_list):
    """Save the Kaggle submition file for Epilepsia Challeng"""

    filep = open("submission.csv", "w") #open submition file for writing

    filep.write("File,Class\n") #save header

    for key in grades_list:
        filep.write("%s,%s\n"%(key[0][0].replace('tfr', 'mat'), key[1][0][0]))

    filep.close()



def main(_):
    """Generates the TF graphs and loads the NN"""

    tf.logging.set_verbosity(tf.logging.INFO)
    with tf.Graph().as_default() as graph:
        # Input pipeline
        filenames = tf.gfile.Glob(FLAGS.dataset_dir)
        data, fnames = read_dataset(filenames,
                                    num_splits=1,
                                    batch_size=1,
                                    is_training=FLAGS.is_training, 
                                    is_testing=True)

        shape = data.get_shape().as_list()
        tf.logging.info('Batch size/num_points: %d/%d' % (shape[0], shape[2]))


        # Create model
        _, predictions = network(data, is_training=FLAGS.is_training)
        tf.logging.info('Network model created.')
        
        # Sliced predictions for AUC calculation: get last column only
        predictions = tf.slice(predictions, [0, 1], [-1, 1])        

        # This ensures that we make a single pass over all of the data.
        num_batches = len(filenames)//1.0

        #
        # Evaluate
        #
        supervi = tf.train.Supervisor(graph=graph,
                                      logdir=FLAGS.log_dir,
                                      summary_op=None,
                                      summary_writer=None,
                                      saver=None,
                                      global_step=slim.get_or_create_global_step(),
                                      init_fn=get_init_fn(FLAGS.checkpoint_dir)) # restores from checkpoint

        with supervi.managed_session(master='', start_standard_services=False) as sess:
            tf.logging.info('Starting evaluation.')
            # Start queues for TFRecords reading
            supervi.start_queue_runners(sess)

            grades = list()
            for i in range(int(num_batches)):
                tf.logging.info('Executing test_op %d/%d', i + 1, num_batches)
                grades.append(sess.run([fnames, predictions]))
                tf.logging.info("%s: %f"%(grades[i][0][0], grades[i][1][0]))

            save_submit(grades)


if __name__ == '__main__':
    tf.app.run()

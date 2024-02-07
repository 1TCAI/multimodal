"""
Reading and Preprocessing of the dataset
"""

from __future__ import print_function
import tensorflow as tf
slim = tf.contrib.slim

def read_dataset(filenames,
                 num_splits=1,
                 batch_size=1,
                 is_training=True,
                 is_testing=False):
    """Reads dataset"""
    with tf.name_scope('read_dataset'):
        tf.logging.info("Reading #%d files." % len(filenames))

        ## TFRecords description for Dataset reader
        keys_to_features = {
            'data': tf.FixedLenFeature([240000*16], tf.float32),
            'label': tf.FixedLenFeature([], tf.int64),
            'filename': tf.FixedLenFeature([], tf.string),
        }
        items_to_handlers = {
            'data': slim.tfexample_decoder.Tensor('data'),
            'label': slim.tfexample_decoder.Tensor('label'),
            'filename': slim.tfexample_decoder.Tensor('filename'),
        }
        decoder = slim.tfexample_decoder.TFExampleDecoder(
            keys_to_features, items_to_handlers)

        items_to_descriptions = {
            'data': '240000x16 channels sample points of iEEG.',
            'label': 'Label 0 indicates interictal and 1 preictal.',
            'filename': 'File name containing the data',
        }

        ## TFRecords files reading
        dataset = slim.dataset.Dataset(data_sources=filenames,
                                       reader=tf.TFRecordReader,
                                       decoder=decoder,
                                       num_samples=1,
                                       items_to_descriptions=items_to_descriptions)

        data_provider = slim.dataset_data_provider.DatasetDataProvider(dataset,
                                                                       shuffle=is_training,
                                                                       num_epochs=None,
                                                                       common_queue_capacity=10*batch_size,
                                                                       common_queue_min=5*batch_size)

        data, label, filename = data_provider.get(['data', 'label', 'filename'])

    with tf.name_scope('preprocess_dataset'):
        # Reshape data to original format: [width, channels]
        data = tf.reshape(data, shape=[240000, 16])    

        def _norm_data(data, reduce_dim):
            # Normalize data: mean=0 and sigma=0.5
            data_mean = tf.expand_dims(tf.reduce_mean(data, reduction_indices=[reduce_dim]), dim=reduce_dim)
            data = tf.sub(data, data_mean)
            data_max = tf.expand_dims(tf.reduce_max(tf.abs(data), reduction_indices=[reduce_dim]), dim=reduce_dim)
            data = tf.div(data, tf.mul(2.0, data_max))
            # 3D tensor with height = 0: [height, width, channels]
            return tf.expand_dims(data, dim=reduce_dim)

        def _train_preproc(data, label):
            # Split data, if split = 1 only expands dim: [num_splits, width, channels]
            data = tf.pack(tf.split(0, num_splits, data), axis=0)

            # Detect dropout segments: indexes > sigma threshold
            _, var = tf.nn.moments(data, axes=[1, 2])
            # tf.where returns a 2D Tensor. reshape it to 1D
            idx_clean = tf.reshape(tf.where(tf.greater(var, 0.5)), shape=[-1])

            # Remove dropout segments
            data = tf.gather(data, idx_clean)

            # Create label array of segments
            num_segments = tf.shape(data)[0]
            label = tf.one_hot(label, 2, dtype=tf.int32)
            label = tf.reshape(tf.tile(label, [num_segments]), shape=[num_segments, 2])

            # Normalize data along dimension 1, dim=0 is splits
            data = _norm_data(data, 1)
            return [data, label]

        def _eval_preproc(data, label):
            return [_norm_data(data, 0), tf.one_hot(label, 2, dtype=tf.int32)]

        def _test_preproc(data, filename):
            return [_norm_data(data, 0), filename]
        
    with tf.name_scope('batch_dataset'):    
        ## Batch 4D tensor: [batch, height, width, channels]
        _capacity = 5*num_splits*batch_size    
        _train_batch = lambda: tf.train.shuffle_batch(_train_preproc(data, label),
                                                      batch_size=batch_size,
                                                      capacity=_capacity,
                                                      min_after_dequeue=3*num_splits*batch_size,
                                                      num_threads=1,
                                                      enqueue_many=True)

        _eval_batch = lambda: tf.train.batch(_eval_preproc(data, label),
                                             batch_size=batch_size,
                                             capacity=_capacity,
                                             num_threads=1)

        _test_batch = lambda: tf.train.batch(_test_preproc(data, filename),
                                             batch_size=batch_size,
                                             capacity=_capacity,
                                             num_threads=1)

        _eval_test_batch = lambda: slim.utils.smart_cond(is_testing, _test_batch, _eval_batch)

        return slim.utils.smart_cond(is_training, _train_batch, _eval_test_batch)


#eegnet
Google DeepMind's WaveNet neural network implementation for epileptic seizures detection in raw iEEG data.


## Intro
This code was developed for the [Kaggle - Melbourne University Seizure Prediction](https://www.kaggle.com/c/melbourne-university-seizure-prediction), where **eegnet_v1 achieved AUC = 0.63 with just ~10 epochs (which took 15h) in [Google Cloud Machine Learning](https://cloud.google.com/ml/)**. Specifics of the gcloud job can be found in `src/scripts/`. No GPUs were used due to unavailability, although its is highly recommended.


#### Features:
- Code developed using [TensorFlow-Slim](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/contrib/slim).
- Data input using [TFRecords](https://www.tensorflow.org/versions/r0.12/how_tos/reading_data/index.html#reading-data) with [TF-Slim Dataset Descriptor](https://github.com/tensorflow/models/tree/master/slim)
- Train code runs in single machine or distributed  - [Between-graph replication](https://www.tensorflow.org/versions/r0.12/how_tos/distributed/index.html#replicated-training)
- Scripts to run in gcloud.


## Table of contents

<a href="#Install">Installation and setup</a><br>
<a href='#Motivation'>Motivation</a><br>
<a href='#Data_challenge'>Dataset and challenge</a><br>
<a href='#eegnet_network'>eegnet network</a><br>
<a href='#TrainEvalTest'>Train, evaluate and test eegnet</a><br>

## Installation and setup
<a id='Install'></a>
#### Install `docker-compose`:
```
sudo pip install docker-compose --force --upgrade
```
#### Run container:
```
docker-compose up -d
```
This will start the container in detached mode and Jupyter will be accessible through `localhost:8888`.

#### Access container bash:
```
docker-compose exec eegnet bash
```

To train the network run the following inside the container:
```
bash scripts/local_train_single.sh
```
or
```
python src/train.py \
  --dataset_dir="/content/dataset/train/*.tfr" \
  --log_dir="/content/logs" \
  --batch_size=3 \
  --num_splits=5 \
  --num_iters=5000
```

#### Basic folder structure
`data/` Folder where [\*.mat files from the competition](https://www.kaggle.com/c/melbourne-university-seizure-prediction/data) are expected to be for conversion to TFRecords.

`dataset/` Folder where \*.tfr files are expected to be for network input.

`checkpoints/` Pre-trained eegnet models.

`checkpoints/eegnetv1_save1/`. eegnet_v1 model which achieved AUC = 0.63

#### Tensorboard
To access [Tensorboard](https://www.tensorflow.org/versions/r0.12/how_tos/summaries_and_tensorboard/index.html) run the following inside the container:
```
tensorboard --logdir=path/to/log-directory
```


## Motivation
<a id='Motivation'></a>

From the beggining the intent was to use a neural network inspired on [Google DeepMind's WaveNet](https://arxiv.org/pdf/1609.03499.pdf) directly on raw iEEG data.

Reading the WaveNet paper was truly inspirational: a demonstration of the power of deep neural networks in extracting relevant features directly from raw audio data. **It is a perfect fit for other kinds of challenging raw data such as brain waves!**


## Dataset and challenge
<a id='Data_challenge'></a>
Bellow is a summary of the details of the [dataset and challenge](https://www.kaggle.com/c/melbourne-university-seizure-prediction/data):

- 10 min segments at 400Hz - 240000 points
- 16 input channels
- 5047 training files (80/20 split for validation)
- 1908 test files

#### Challenge
> The challenge is to distinguish between ten minute long data clips covering an hour prior to a seizure, and ten minute iEEG clips of interictal activity. Seizures are known to cluster, or occur in groups. Patients who typically have seizure clusters receive little benefit from forecasting follow-on seizures. For this contest only lead seizures, defined here as seizures occurring four hours or more after another seizure, are included in the training and testing data sets. In order to avoid any potential contamination between interictal, preictal, and post-ictal EEG signals, interictal data segments were restricted to be at least four hours before or after any seizure. Interictal data segments were chosen at random within these restrictions.


## eegnet network
<a id='eegnet_network'></a>

The TF network code can be found in [eegnet/src/eegnet/eegnet_vX.py](https://github.com/projectappia/eegnet/tree/master/src/eegnet).

The main difference between WaveNet and eegnet resides in the latter being trained only with a classification loss. Due to the nature of the data, 16 input channels, it was discarded training the network in predicting the next sample point as well. This compromise, on the other hand, allows eegnet to be applied directly on raw data of 16 input channels, without any companding transformation as in WaveNet.

eegnet uses **dilated convolutions** as opposed to LSTM to model the intrinsic characteristics of the input data, which allows eegnet to be applied to inputs of any size. Although given the input file size of 240000 points, to alleviate computation resources, there is the choice of the user splitting the input file into smaller size segments. As will be explained later, this showed to produce a collateral effect of increasing the _'dataset entropy'_, decreasing the learning rate. It was concluded that for this dataset a full input file of 10 min is the best compromise between necessary information for seizure detection and _'dataset entropy'_.

As in WaveNet use for speech recognition, an **average pool layer** is placed on top of the **input** and **dilated convolution blocks** to aggregate the activations to a fixed size from which **logits** are extracted using normal convolutions and a fully connected layer.

#### Architecture overview
...Picture...


#### Reasons behind eegnet architecture:
- Bigger average pool layer increases AUC.
- Bigger splits size increases AUC. In fact, whole file (split 1) is essential to get good results and train on whole dataset, otherwise the _entropy_ of small splits sizes is too big for model to generalize and learn.
- eegnet_v2, a smaller version with only two dilated blocks, no residual connections, achieved good learning rates, especially because it was possible to do many more epochs than with eegnet_v1. Although, results on validation and test data (through Kaggle submission) showed that the network didn't generalize well.
- Logits obtained from last dilated block vs logits from skip connections (as in WaveNet) showed slightly worse results in our tests.
- It was attempted to increase learning rate by training with two logits losses: logits from last dilated block and logits from skip connections. No improvements were observed.
- Bigger batch sizes produce better results. Given the input file size, one can easily run out of RAM with big batch sizes, although going for online training (batch_size = 1) is not advised. Good results were achieved with batch_size = 7 (limited by gcloud complex_model_l RAM).
- Introducing more convolutions in logits processing didn't improve results, which makes sense, the main feature extractors and core of this network are the dilated convolution blocks.
- Best initial learning rate determined to be 1e-3, bigger would cause the network not to converge.
- ADAM optimizer produced good results and was chosen.

#### Lessons learnt:
- Weights and biases regularization and dropout are essential to fight overfitting.
- Start training with a small train dataset and network, if using Inception or WaveNet blocks, implement blocks but keep number small. This approach helps to detect implementation mistakes early, perform quick iterations to decide on architecture and should already converge, giving you confidence over the chosen approach.
- With stacked convolution layers the total receptive field increases with depth increase. Atrous/dilated convolutions increase the effect even more while keeping computation down.
- With residual connections don't apply activation and normalization functions.
- Almost always use activation and normalization functions between layers, even in 1x1 (compress/expand) convolutions.
- Last fully connected layer before softmax do not use activation or normalization functions.
- It's good practice to use a 1x1 feature compressing layer before a 3x3/5x5/7x7 convolution. Makes computation faster and uses proven embeddings principle of data representation.
- Always normalize input data with mean = 0 and std < 1, the latter is important as well to avoid [activation functions saturation](http://jmlr.org/proceedings/papers/v9/glorot10a/glorot10a.pdf).
- When inspecting network train take into consideration minibatch loss and accuracy and validation accuracy (great measurement of network overiftting).

#### Important:
The main constraint on using eegnet directly on raw data is the computational resources necessary. GPUs are highly recommended but were still unavailable in gcloud at the time of development of this project. AWS is also being investigated but nothing to report at the moment still.

> eegnet_v1 achieved the abovementioned results with only **~10 epochs** of training and having only **6 dilated blocks**. With more epochs and a network with 20+ dilated blocks as WaveNet, we believe the AUC results would have been truly inspiring.


## Train, evaluate and test eegnet
<a id='TrainEvalTest'></a>

It is advised to train using `batch_size > 1` and `num_splits = 1`, although in a laptop you can easily run out of memory.

#### Train locally - single
From inside the container run:
```
bash scripts/local_train_single.sh
```

#### Train locally - distributed
```
bash scripts/local_train_distributed.sh
```
With `--distributed` gcloud automatically launches several python instances which are configure with a json loaded environment variable TF_CONFIG. Find an example [here](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/contrib/learn/python/learn/estimators/run_config.py) or check [gcloud distributed example code](https://github.com/GoogleCloudPlatform/cloudml-samples/blob/master/mnist/distributed/trainer/task.py).

#### Train gcloud - distributed
Follow the [gcloud init steps](https://cloud.google.com/ml/docs/how-tos/getting-set-up) to setup a gcloud project and bucket using a google account, then simply run `bash scripts/gcloud_train.sh`.

#### Evaluation and test
Evaluation and test also have dedicated scripts and in the case of test it will generate a [submission file.](https://www.kaggle.com/c/melbourne-university-seizure-prediction/submissions/attach)



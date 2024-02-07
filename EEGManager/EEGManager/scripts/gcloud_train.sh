#!/bin/bash

# Quit early if any command fails.
set -ex

# Environment variables for the job
USER=cl3ntist
JOB_NAME=eegnet_distributed_${USER}_$(date +%Y%m%d_%H%M%S)
PROJECT_ID=`gcloud config list project --format "value(core.project)"`
TRAIN_BUCKET=gs://${PROJECT_ID}-ml
TRAIN_PATH=${TRAIN_BUCKET}/${JOB_NAME}

# Prepare python package
cd /content && \
rm -rf package/ && mkdir package/ && \
cp -r src/ package/ && cd package/

# Submit job
gcloud beta ml jobs submit training ${JOB_NAME} \
  --package-path=src \
  --module-name=src.train \
  --staging-bucket="${TRAIN_BUCKET}" \
  --region=us-east1 \
  --config=/content/scripts/config_gcloud.yaml \
  -- \
  --dataset_dir="${TRAIN_BUCKET}/train/*.tfr" \
  --checkpoint_dir="${TRAIN_BUCKET}/checkpoints/third_pool2400_split1_batch7" \
  --log_dir="${TRAIN_PATH}" \
  --batch_size=7 \
  --num_splits=1 \
  --num_iters=5000

#!/bin/bash

# Quit early if any command fails.
set -ex

cd /content && \
gcloud beta ml local train \
  --package-path=src \
  --module-name=src.test \
  -- \
  --dataset_dir="/content/dataset/test/*.tfr" \
  --checkpoint_dir="/content/checkpoints/eegnetv1_save1" \
  --log_dir="/content/logs"


# Sentiment Analysis with LSTM-CNN Neural Network

## Introduction

The main objective of the project is to develop sentiment classification models using machine learning techniques to predict the sentiment of yelp reviews. The levels of sentiment from 1 to 5. Correspondingly, these are strong negative, weak negative, neutral, weak positive and strong positive. We aim to see how accurately we can assign these labels.


## Usage
### Environment
The program was built using the google cloud colaboratory environment. In order to run the code, a colaboratory environment will be necessary.


### Setup for preprocessing
The first two sections of the program are titled  “Google Colab Setup” and “Setup for GPU preprocessing”. These include all the necessary libraries for the program. These should be run using colab’s GPU hardware accelerator. To do so, go to runtime and change runtime type to GPU.

To import the files into colab enviroment, a drive may be mounted. The code for this has been shown in the “Import Files” section. The files will have to be added to the drive. Afterwards, the path of the file can be obtained by going to the file tab on the left and copying the path.

With the initial setup in place, the preprocessing can be done by simply running the cells. All necessary libraries are also included in the colab setup section.


### Setup for Model 
The model was built using colab’s TPU hardware accelerator. To run the code related to hyperparameter tuning, training the model and prediction, the runtime type should be changed to TPU.

Once the this has been done, one can simply run all the code under the “Model” section.

Input: The model requires a vector of integers of length 400. Each integer corresponds to a word in the vocabulary. Unknown words are assigned 0.
Output: The model outputs a vector of length 5. Each cell is the probability it belongs to the category which is the index of the cell plus one.


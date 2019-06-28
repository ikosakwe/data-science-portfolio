# Data Stream Clustering Analysis

The purpose of this program is to monitors a server directory and dynamically build and update a K-Means clustering model as new data
becomes available. 

The accompanying k-means.scala script contains th implementation of the application in spark. The application required 2-dimensional data.

The python script: k-means.py generates suitable files with pseudo-
random datapoints to be used as input for the stream processing application.


## Usage
To see the algorithm in action the following preparatory steps should be taken:
1. Place the k-means.scala as well as k-means.py script in a folder
2. Ensure that two subdirectories, './testDir', and './trainingDir' exist
With this environment in place, start the k-means streaming algorithm from the terminal:
$ cat k-means.scala | spark-shell (or however you initiate your spark shell)

This starts the Spark streaming algorithm. The application is now actively monitoring the './trainingDir'
directory for any new data files. If new data is found it will automatically be parsed and used to update the
cluster centroids.

Now, from another terminal at the same directory, execute the auxilary python script to start generating a
sample data flow:
$ python k-means.py

This script now generates random data files in 2 second intervals so that the stream clustering process
can be observed in real-time. As new text files get added to trainingDir the cluster centers
continuously update. The same data is also copied into testDir and we can see the predicted cluster
labels for each data entry in the spark terminal.

/* 
============================================
=== FIT5202 Data Processing for Big Data ===
======= Assignment II - PoC1 K-Means =======
============================================

===== GROUP 3: =====
Arno Angerer, 29909163
Sneha Ravikumar, 29391911
Marek Schumann, 29971683
Josefine Tusindfryd, 29876893
Richard Osakwe, 29466695 


========================================
============== DESCRIPTION =============
========================================

This file contains our proof of concept implementation for
the K-Means Streaming Algorithm. This implementation is heavily
inspired by the StreamingKMeans sample implementation found here:
https://github.com/apache/spark/blob/branch-1.2/examples/src/main
/scala/org/apache/spark/examples/mllib/StreamingKMeansExample.scala

========================================
================ USAGE =================
========================================

To execute the algorithm from within the BigVM, this k-means.scala
script should be placed in a folder together with the k-means.py script.
Also, the two subdirectories, './testDir' and './trainingDir', should be present.

With this environment in place, start the K-Means Streaming algorithm via
$ cat k-means.scala | spark-shell

This starts the Spark streaming algorithm. Our program is now actively monitoring the
'./trainingDir' directory for any new data files. If new data is found it will 
automatically be parsed and used to update the cluster centroids accordingly.

Then, from another terminal window in the same directory, execute the provided
python script to start generating a sample data flow:
$ python k-means.py 

This script will generate random data files with in 2 second intervals so that the
clustering process can be observed in real-time. As we add text files to `trainingDir` 
the clusters will continuously update. Then, when we add the file to `testDir` we will
obtain the predicted labels using the most up-to-date model.
*/


// Import Relevant Libraries
import org.apache.spark.SparkConf
import org.apache.spark.mllib.clustering.StreamingKMeans
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.streaming.{Seconds, StreamingContext}

// Define dynamic Streaming Object
object StreamingKMeansPoC {

  def main(args: Array[String]) {
    if (args.length != 4) {
      System.err.println(
        "Error: Wrong number of arguments provided." +
        "Please provide the following arguments:" +
          "<trainingDir> <testDir> <interval> <number_of_clusters>")
      System.exit(1)
    }

    val conf = new SparkConf().setMaster("local").setAppName("StreamingKMeansPoC")
    
    // Initialise Spark Streaming Context
    val ssc = new StreamingContext(conf, Seconds(args(2).toLong))

    // Set up directory monitoring streams and appropriate parsers
    val trainingData = ssc.textFileStream(args(0)).map(Vectors.parse)
    val testData = ssc.textFileStream(args(1)).map(LabeledPoint.parse)

    // Create StreamingKMeans model object
    val model = new StreamingKMeans()
      .setDecayFactor(1.0) // no decay
      .setK(args(3).toInt) // number of clusters
      .setRandomCenters(2, 0.0) // initialise random centroids (2d)

    // Specify incoming stream to train model on
    model.trainOn(trainingData) 

    // Use the model to make predictions and print results (label + cluster)
    model.predictOnValues(testData.map(lp => (lp.label.toInt, lp.features))).print()
    
    // Store latest model for inspection and debugging
    val latestModel = model.latestModel().clusterCenters

    ssc.start()
    ssc.awaitTermination()
  }
}

// Stop previously running Spark Context
sc.stop()

// Run K-Means with desired properties i.e. 
// 3s batch interval and 3 clusters
StreamingKMeansPoC.main(Array("trainingDir","testDir","3","3"))

# ============================================
# === FIT5202 Data Processing for Big Data ===
# ======= Assignment II - PoC1 K-Means =======
# ============ Auxilary Script ===============
# ============================================
# 
# ===== GROUP 3: =====
# Arno Angerer, 29909163
# Sneha Ravikumar, 29391911
# Marek Schumann, 29971683
# Josefine Tusindfryd, 29876893
# Richard Osakwe, 29466695 

# ========================================
# ============== DESCRIPTION =============
# ========================================
# 
# This file contains the auxilary python script that
# creates a stream of random datapoints to be consumed
# by our K-Means clustering application.
# See the `k-means.scala` file or the accompanying
# documentation for usage instructions.


# Import relevant libraries
import os
import random
import time

# Clean up data files from last run
os.system("rm ./testDir/* 2> /dev/null")
os.system("rm ./trainingDir/* 2> /dev/null")


# Create random points belonging to one of three clusters:
def create_random_points(n = 10,start_idx = 1):
    random_points = [(random.randint(0,12),random.randint(0,18)) for x in range(n//3)]
    random_points.extend([(random.randint(20,34),random.randint(30,62)) for x in range(n//3)])
    random_points.extend([(random.randint(60,95),random.randint(70,100)) for x in range(n//3)])
    random_points = (list(enumerate(random_points,start_idx)))
    next_idx = start_idx + len(random_points)
    return (random_points,next_idx)


# Define function to write train and test files
def create_files(list_of_points, iteration):
    # Create train file
    train_file_handle = open("./trainingDir/train" + str(iteration + 1) + ".txt", 'w')
    for point in list_of_points:
        train_file_handle.write("[" + str(point[1][0]) + "," + str(point[1][1]) + ']\n')
    train_file_handle.close()
    
    # Create test file
    test_file_handle = open("./testDir/test" + str(iteration + 1) + ".txt", 'w')
    for point in list_of_points:
        test_file_handle.write("(" + str(point[0]) + ",[" + str(point[1][0]) + "," + str(point[1][1]) + "])\n")
    test_file_handle.close()

# Create 'stream' of incoming data files
idx = 1 # set starting index
number_of_files = 10
datapoints_per_file = 10
interval_of_arrival = 2
for batch in range(number_of_files):
    data, idx = create_random_points(datapoints_per_file,idx)
    create_files(data,batch)
    time.sleep(interval_of_arrival)
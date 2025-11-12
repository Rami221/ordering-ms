pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('b50be508-3811-4971-abb5-16cf45a275b7')
        IMAGE_AUTH = "rami223/auth-service:latest"
        IMAGE_ORDER = "rami223/order-service:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/Rami221/ordering-ms.git', branch: 'main'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t $IMAGE_AUTH ./auth-service'
                sh 'docker build -t $IMAGE_ORDER ./order-service'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push $IMAGE_AUTH'
                sh 'docker push $IMAGE_ORDER'
            }
        }

        stage('Deploy to Swarm') {
            steps {
                sh '''
                docker stack deploy -c docker-compose.yml ordering
                '''
            }
        }
    }
}

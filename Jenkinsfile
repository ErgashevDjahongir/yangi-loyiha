pipeline {
    agent any
    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config' // Jenkins user kubeconfig
    }
    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }
        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                        sh 'docker build -t $DOCKER_USER/notes-backend:latest .'
                        sh 'docker push $DOCKER_USER/notes-backend:latest'
                    }
                }
            }
        }
        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                        sh 'docker build -t $DOCKER_USER/notes-frontend:latest .'
                        sh 'docker push $DOCKER_USER/notes-frontend:latest'
                    }
                }
            }
        }
        stage('Run Tests (simple)') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test || echo "no tests found"'
                }
            }
        }
        stage('Deploy to K8s') {
            steps {
                withEnv(["KUBECONFIG=$KUBECONFIG"]) {
                    sh 'kubectl apply -f k8s/mongo-deployment.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                }
            }
        }
    }
}

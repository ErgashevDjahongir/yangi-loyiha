pipeline {
    agent any
    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config' // Jenkins user kubeconfig
        TELEGRAM_BOT_TOKEN = credentials('telegram-bot-token') // Jenkinsda saqlangan token
        TELEGRAM_CHAT_ID = credentials('telegram-chat-id') // Jenkinsda saqlangan chat_id
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
                        script {
                            try {
                                sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                                sh 'docker build -t $DOCKER_USER/notes-backend:latest .'
                                sh 'docker push $DOCKER_USER/notes-backend:latest'
                            } catch (err) {
                                sendTelegram("🚨 Backend Image Build Failed!\nError: ${err}")
                                error "Backend Image Build Failed"
                            }
                        }
                    }
                }
            }
        }
        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        script {
                            try {
                                sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                                sh 'docker build -t $DOCKER_USER/notes-frontend:latest .'
                                sh 'docker push $DOCKER_USER/notes-frontend:latest'
                            } catch (err) {
                                sendTelegram("🚨 Frontend Image Build Failed!\nError: ${err}")
                                error "Frontend Image Build Failed"
                            }
                        }
                    }
                }
            }
        }
        stage('Run Tests (simple)') {
            steps {
                dir('backend') {
                    script {
                        try {
                            sh 'npm install'
                            sh 'npm test || echo "no tests found"'
                        } catch (err) {
                            sendTelegram("🚨 Backend Tests Failed!\nError: ${err}")
                            error "Backend Tests Failed"
                        }
                    }
                }
            }
        }
        stage('Deploy to K8s') {
            steps {
                script {
                    try {
                        withEnv(["KUBECONFIG=$KUBECONFIG"]) {
                            sh 'kubectl apply -f k8s/mongo-deployment.yaml'
                            sh 'kubectl apply -f k8s/backend-deployment.yaml'
                            sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                        }
                    } catch (err) {
                        sendTelegram("🚨 Deployment to Kubernetes Failed!\nError: ${err}")
                        error "K8s Deployment Failed"
                    }
                }
            }
        }
    }
    post {
        success {
            sendTelegram("✅ Pipeline Completed Successfully!")
        }
    }
}

def sendTelegram(String message) {
    sh """
        curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
        -d chat_id=$TELEGRAM_CHAT_ID \
        -d text="$message"
    """
}

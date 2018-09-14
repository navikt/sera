import groovy.json.JsonSlurper;
node {
    def npm, node // tools
    def groupId = "nais"
    def appConfig = "nais.yaml"
    def committer, committerEmail, changelog // metadata
    def application = "sera"
    def dockerDir = "./docker"
    def distDir = "${dockerDir}/dist"
    def nextVersion, releaseVersion


    try {
        stage("checkout") {
            git credentialsId: 'navikt-ci',
                git url: "http://github.com/navikt/${application}.git"
        
            }

        stage("initialize") {
            npm = "/usr/bin/npm"
            node = "/usr/bin/node"
			changelog = sh(script: 'git log `git describe --tags --abbrev=0`..HEAD --oneline', returnStdout: true)
            releaseVersion = sh(script: 'npm version major | cut -d"v" -f2', returnStdout: true).trim()
             // aborts pipeline if releaseVersion already is released
             sh "if [ \$(curl -s -o /dev/null -I -w \"%{http_code}\" http://maven.adeo.no/m2internal/no/nav/aura/${application}/${application}/${releaseVersion}) != 404 ]; then echo \"this version is somehow already released, manually update to a unreleased SNAPSHOT version\"; exit 1; fi"
             committer = sh(script: 'git log -1 --pretty=format:"%ae (%an)"', returnStdout: true).trim()
             committerEmail = sh(script: 'git log -1 --pretty=format:"%ae"', returnStdout: true).trim()
        }
        
        stage("run unit tests") {
                withEnv(['HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=adeo.no']) {
                        sh "npm install"
                        sh "npm run unittest"
                }
        }

        stage("build frontend bundle") {
                withEnv(['HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=adeo.no']) {
                // installing modules and building front-end bundle
                sh "npm install && npm run build || exit 1"
                // copying files to docker image
                sh "mkdir -p ${distDir}"
                sh "cp -r production_server.js app.js package.json dist api ${distDir}"
                // workaround for local variables being required production environment
                sh "echo {} > ${distDir}/localvars.json"
                // getting modules for production
                sh "cd ${distDir} && npm install --production || exit 1"
                sh "cp Dockerfile ${dockerDir}"
                }
        }

        stage("build and publish docker image") {
                    def imageName = "docker.adeo.no:5000/${application}:${releaseVersion}"
                    sh "sudo docker build -t ${imageName} ./docker"
                    sh "sudo docker push ${imageName}"
        }

        stage("publish yaml") {
            withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'nexusUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
             sh "curl -s -F r=m2internal -F hasPom=false -F e=yaml -F g=${groupId} -F a=${application} -F v=${releaseVersion} -F p=yaml -F file=@${appConfig} -u ${env.USERNAME}:${env.PASSWORD} http://maven.adeo.no/nexus/service/local/artifact/maven/content"
                 }
           	}

        stage("set version") {
            sh "git tag -a ${application}-${releaseVersion} -m ${application}-${releaseVersion}"
			sh "git push --tags" 
            sh "git push origin master"
        }

        stage("deploy to !prod") {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'srvauraautodeploy', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh "curl -k -d \'{\"application\": \"${application}\", \"version\": \"${releaseVersion}\", \"fasitEnvironment\": \"q1\", \"zone\": \"fss\", \"namespace\": \"default\", \"fasitUsername\": \"${env.USERNAME}\", \"fasitPassword\": \"${env.PASSWORD}\"}\' https://daemon.nais.preprod.local/deploy"
                }
        }

        stage("verify resources") {
			retry(15) {
				sleep 5
                httpRequest consoleLogResponseBody: true,
                            ignoreSslErrors: true,
                            responseHandle: 'NONE',
                            url: 'https://sera.nais.preprod.local/isalive',
                            validResponseCodes: '200'
			}
        }

        stage("deploy to prod") {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'srvauraautodeploy', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh "curl -k -d \'{\"application\": \"${application}\", \"version\": \"${releaseVersion}\", \"fasitEnvironment\": \"p\", \"zone\": \"fss\", \"namespace\": \"default\", \"fasitUsername\": \"${env.USERNAME}\", \"fasitPassword\": \"${env.PASSWORD}\"}\' https://daemon.nais.adeo.no/deploy"
                }
        }

        slackSend channel: '#nais-ci', message: ":nais: Successfully deployed ${application}:${releaseVersion} to prod :partyparrot: \nhttps://${application}.nais.adeo.no\nLast commit by ${committer}.", teamDomain: 'nav-it', tokenCredentialId: 'slack_fasit_frontend'
        if (currentBuild.result == null) {
            currentBuild.result = "SUCCESS"
        }

    } catch(e) {
        if (currentBuild.result == null) {
            currentBuild.result = "FAILURE"
        }
        slackSend channel: '#nais-ci', message: ":shit: Failed deploying ${application}:${releaseVersion}: ${e.getMessage()}. See log for more info ${env.BUILD_URL}", teamDomain: 'nav-it', tokenCredentialId: 'slack_fasit_frontend'
        throw e
    } finally {
        step([$class       : 'InfluxDbPublisher',
              customData   : null,
              customDataMap: null,
              customPrefix : null,
              target       : 'influxDB'])
    }
}

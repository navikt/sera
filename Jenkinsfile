import groovy.json.JsonSlurper;
node {
    def npm, node // tools
    def groupId = "nais"
    def appConfig = "nais.yaml"
    def committer, committerEmail, changelog // metadata
    def application = "sera"
    def dockerDir = "./docker"
    def distDir = "${dockerDir}/dist"
    def currentVersion, nextVersion


    try {
        stage("checkout") {
                git url: "ssh://git@stash.devillo.no:7999/aura/${application}.git"
        
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
                sh "cp -r production_server.js app.js package.json dist api app-config ${distDir}"
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
        }

        stage("deploy to !prod") {
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'srvauraautodeploy', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
                    sh "curl -k -d \'{\"application\": \"${application}\", \"version\": \"${releaseVersion}\", \"environment\": \"cd-u1\", \"zone\": \"fss\", \"namespace\": \"default\", \"username\": \"${env.USERNAME}\", \"password\": \"${env.PASSWORD}\"}\' https://daemon.nais.preprod.local/deploy"
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
                    sh "curl -k -d \'{\"application\": \"${application}\", \"version\": \"${releaseVersion}\", \"environment\": \"p\", \"zone\": \"fss\", \"namespace\": \"default\", \"username\": \"${env.USERNAME}\", \"password\": \"${env.PASSWORD}\"}\' https://daemon.nais.adeo.no/deploy"
                }
        }

        stage("update version") {
            currentVersion = sh "echo ${releaseVersion} | cut -d. -f1" 
            newVersion = (currentVersion.toInteger() + 1) + ".0.0"
            sh "sed -i 's/\"version\": \"'${releaseVersion}'\"/\"version\": \"'${newVersion}'\"/g' package.json"
            sh "git push origin master"
        }

        slackSend channel: '#nais-internal', message: ":nais: Successfully deployed ${application}:${releaseVersion} to prod :partyparrot: \nhttps://${application}.nais.adeo.no\nLast commit by ${committer}.", teamDomain: 'nav-it', tokenCredentialId: 'slack_fasit_frontend'
        if (currentBuild.result == null) {
            currentBuild.result = "SUCCESS"
        }

    } catch(e) {
        if (currentBuild.result == null) {
            currentBuild.result = "FAILURE"
        }
        slackSend channel: '#nais-internal', message: ":shit: Failed deploying ${application}:${releaseVersion}: ${e.getMessage()}. See log for more info ${env.BUILD_URL}", teamDomain: 'nav-it', tokenCredentialId: 'slack_fasit_frontend'
        throw e
    } finally {
        step([$class       : 'InfluxDbPublisher',
              customData   : null,
              customDataMap: null,
              customPrefix : null,
              target       : 'influxDB'])
    }
}
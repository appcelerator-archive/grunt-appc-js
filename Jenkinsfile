library 'pipeline-library@additions'

@NonCPS
def parseOriginURL(def url) {
	// Hack the url to include username and password in the URL!
	def matcher = (url =~ "github.com[:/]([^/]+)/(.+)?\\.git")
	def org = matcher[0][1]
	def project = matcher[0][2]
	return [org, project]
}

timestamps {
	node('(osx || linux) && git') {
		def packageVersion = ''
		def isPR = false
		def tagGit = true

		stage('Checkout') {
			checkout scm

			isPR = env.BRANCH_NAME.startsWith('PR-')
			tagGit = !isPR

			def packageJSON = jsonParse(readFile('package.json'))
			packageVersion = packageJSON['version']
			currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
		}

		nodejs(nodeJSInstallationName: 'node 6.9.5') {
			ansiColor('xterm') {

				stage('Dependencies') {
					sh 'npm install --production'
				} // stage

				stage('Security') {
					// Scan for NSP and RetireJS warnings
					sh 'npm install nsp'
					sh 'node_modules/nsp/bin/nsp check --output summary --warn-only'
					sh 'npm uninstall nsp'
					sh 'npm prune'

					sh 'npm install retire'
					sh 'node_modules/retire/bin/retire --exitwith 0'
					sh 'npm uninstall retire'
					sh 'npm prune'

					step([$class: 'WarningsPublisher', canComputeNew: false, canResolveRelativePaths: false, consoleParsers: [[parserName: 'Node Security Project Vulnerabilities'], [parserName: 'RetireJS']], defaultEncoding: '', excludePattern: '', healthy: '', includePattern: '', messagesPattern: '', unHealthy: ''])
				}

				stage('Build') {
					sh 'npm install'
					sh 'npm test'
				} // stage

				stage('Publish') {
					if (tagGit) {
						// FIXME Include changes in the tag message?
						sh "git tag -a '${packageVersion}' -f -m 'See ${env.BUILD_URL} for more information.'"

						// HACK to provide credentials for git tag push
						// Replace once https://issues.jenkins-ci.org/browse/JENKINS-28335 is resolved
						withCredentials([usernamePassword(credentialsId: 'f63e8a0a-536e-4695-aaf1-7a0098147b59', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
							echo "Force pushing ${packageVersion} tag"
							def url = sh(returnStdout: true, script: 'git config --get remote.origin.url').trim()
							def parts = parseOriginURL(url)
							def org = parts[0]
							def project = parts[1]
							try {
								sh "git config remote.origin.url 'https://${USER}:${PASS}@github.com/${org}/${project}.git'"
								sh "git push origin ${packageVersion} --force"
							} catch (e) {
								throw e
							} finally {
								// Reset the url value
								sh "git config remote.origin.url \"${url}\""
							}
						} // withCredentials
					} // tagGit
				} // stage
			} // ansiColor
		} // nodejs
	} // node
} // timestamps

var folders = [
	'public',
	'admin',
	'app/error_catcher',
	'app/first_config'
]
class Compil_stylus {
	constructor(folders) {
		this.folders = folders
		this.walk = require('walk')
		this.exec = require('child_process').exec
		this.files = []
		this.nb_folder_started = 0
		this.nb_file_done = 0
		this.run()
		this.start_time = new Date()
	}
	puts(error, stdout, stderr) {
		var that = compil_stylus
		that.nb_file_done += 1
		console.log(stdout.split('Output saved to:')[1].trim())
		if (error) console.log(error)
		if (that.nb_file_done === that.files.length) {
			var time = (new Date() - that.start_time) / 1000
			console.log('Done in ' + time + 's')
		}
	}
	run() {
		for (var i in this.folders) {
			var walker = this.walk.walk('./' + this.folders[i], { followLinks: false })
			walker.on('file', (root, stat, next) => {
				if (stat.name.endsWith('.css')) {
					var path_and_file = root + '/' + stat.name
					this.exec(
						`css2stylus ${path_and_file} --indent 4 --force --out ${root}`,
						this.puts
					)
					this.files.push(root + '/' + stat.name)
				}
				next()
			})
			walker.on('end', () => {
				this.nb_folder_started += 1
				if (this.nb_folder_started === this.folders.length) {
					console.log(this.files.length + ' files to compile')
				}
			})
		}
	}
}
var compil_stylus = new Compil_stylus(folders)
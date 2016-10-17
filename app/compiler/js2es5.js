var folders = [
	'public',
	'admin',
	'app/js',
	'app/app',
	'app/js_head',
	'app/error_catcher',
	'app/first_config'
]
class Compil_to_es5 {
	constructor(folders) {
		this.folders = folders
		this.exec = require('child_process').exec
		this.walk = require('walk')
		this.files = []
		this.nb_folder_started = 0
		this.nb_file_done = 0
		this.run()
		this.start_time = new Date()
	}
	puts(error, stdout, stderr) {
		var that = compil_to_es5
		that.nb_file_done += 1
		console.log(stdout.trim())
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
				if (stat.name.endsWith('.js') && !stat.name.endsWith('_compiled.js')) {
					var path_and_file = root + '/' + stat.name,
						path_and_file_compiled = path_and_file.replace('.js', '_compiled.js')
					this.exec(
						`babel ${path_and_file} --out-file ${path_and_file_compiled};
						echo ${stat.name}`,
						this.puts
					)
					this.files.push(root + '/' + stat.name)
				}
				next()
			})
			walker.on('end', () => {
				this.nb_folder_started += 1
				if (this.nb_folder_started === this.folders.length) {
					console.log(this.files.length + ' files to compil')
				}
			})
		}
	}
}
var compil_to_es5 = new Compil_to_es5(folders)
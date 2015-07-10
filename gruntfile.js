module.exports = function(grunt) {

  // Load tasks
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', '_theme/24hl/js/24hl.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    less: {
      options: {
        paths: ["_themes/24hl/src/less"]
      },
      dev: {
        files: {
          "_themes/24hl/css/24hl.css": "_themes/24hl/src/less/24hl.less"
        }
      },
      prod: {
        options: {
          plugins: [
            new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
            new (require('less-plugin-clean-css'))({advanced: true})
          ]
        },
        files: {
          "_themes/24hl/css/24hl.min.css": "_themes/24hl/src/less/24hl.less"
        }
      }
    },

    uglify: {
      prod: {
        files: {
          '_themes/24hl/js/min/kinder.min.js': ['_themes/24hl/js/*.js']
        }
      }
    },

    imagemin: {                          // Task
      prod: {                         // Another target
        files: [{
          expand: true,
          flat: true,                  // Enable dynamic expansion
          cwd: '_themes/24hl/src/img/',                   // Src matches are relative to this path
          src: ['**/*'],   // Actual patterns to match
          dest: '_themes/24hl/img/'                  // Destination path prefix
        }]
      }
    },

    // Grunt Php
    php: {
      watch: {
        options: {
          port: 8080,
          open: 'http://localhost:8080/'
        }
      }
    },

    'ftp-deploy': {
      options: {
      },
      prod: {
        forceVerbose: true,
        auth: {
          host: '24hourlime.com.au',
          port: 21,
          authKey: 'prod'
        },
        src: './',
        dest: '/public_html',
        exclusions: [
          '.elasticbeanstalk',
          '.git',
          '.vagrant',
          '.ftppass',
          '_forms',
          'node_modules',
          'bower_components',
        ]
      }
    },

    // Watch process
    watch: {
      options: {
        livereload: 8090
      },
      jshint: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      less: {
        options: {
          livereload: false
        },
        files: ['_themes/24hl/src/less/**/*.less'],
        tasks: ['less:dev']
      },
      css: {
        files: ['_themes/24hl/css/*.css']
      },
      html: {
        files: ['_themes/24hl/**/*.html', '_content/**/*.md']
      },
      images: {
        files: ['_themes/24hl/src/img/**/*'],
        tasks: ['imagemin:prod']
      },
      gruntfile: {
        files: ['gruntfile.js']
      }
    }
  });

  grunt.registerTask('prod',    ['jshint', 'less:prod', 'uglify:prod', 'imagemin:prod', 'ftp-deploy']);

  grunt.registerTask('default', ['jshint', 'less:dev', 'imagemin:prod', 'php:watch', 'watch']);

};

const { src, dest, task, parallel } = require('gulp')
const bro = require('gulp-bro')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const dotenv = require('dotenv')

const files = glob.sync('src/*.js')
dotenv.config()

const weditPath = (process.env.MC_PATH === undefined) ? __dirname : path.resolve(process.env.MC_PATH, './config/worldedit')
for (let i = 0; i < files.length; i++) {
  task(path.basename(files[i], '.js'), () => {
    return bundle(files[i])
  })
}

const transform = [
  ['babelify', {
    presets: [
      ['@babel/preset-env', {
        targets: { firefox: '2' }
      }]
    ]
  }]
]

const plugin = process.env.DEBUG ? [] : [
  ['tinyify', {
    env: { IGN_API_KEY: process.env.IGN_API_KEY || 'choisirgeoportail' }
  }]
]

function bundle (file) {
  return src(file)
    .pipe(bro({ transform, plugin }))
    .pipe(dest(path.resolve(weditPath, './craftscripts')))
}

task('copyData', (cb) => {
  fs.mkdir(path.resolve(weditPath, './craftscripts'), (err) => {
    if (err && err.code !== 'EEXIST') throw err
    fs.mkdir(path.resolve(weditPath, './craftscripts/data'), (err) => {
      if (err && err.code !== 'EEXIST') throw err
      fs.copyFile(path.resolve(__dirname, './src/data/conformal.txt'), path.resolve(weditPath, './craftscripts/data/conformal.txt'), (err) => {
        if (err) throw err
        fs.copyFile(path.resolve(__dirname, './src/config.json'), path.resolve(weditPath, './craftscripts/config.json'), (err) => {
          if (err) throw err
          cb()
        })
      })
    })
  })
})

task('default', parallel(files.map((value) => path.basename(value, '.js')), 'copyData'))

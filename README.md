# Gulpcommons

Common gulp tasks repository/generator

### Dependencies

You might want to install some of the following dependencies to unlock all the features:

- `gulp-clean ^0.4.0` used in all built-in suites to generate clean* tasks.
- `gulp-typescript ^6.0.0-alpha.1` used in built-in typescript suite to generate compileTypescript* tasks.
- `gulp-sass ^5.1.0` and `sass ^1.49.8` used in built-in sass suite to generate compileSass* tasks

### Built-in

This is an example gulpfile that uses the built-in tasks.

```typescript
const gulp = require('gulp')
const {tasks} = require('gulpcommons')

gulp.task('build', gulp.parallel(
    // main
    tasks.compileMainTypescript,
    tasks.bundleMainResources,
    // test
    tasks.compileTestTypescript,
    tasks.bundleTestResources,
    // client
    tasks.compileClientTypescript,
    tasks.compileClientSass,
    tasks.bundleClientStatic,
    tasks.bundleClientViews,
    // config
    tasks.bundleConfigEnv
))
gulp.task('clean', gulp.parallel(
    // main
    tasks.cleanMainTypescript,
    tasks.cleanMainResources,
    // test
    tasks.cleanTestTypescript,
    tasks.cleanTestResources,
    // client
    tasks.cleanClientTypescript,
    tasks.cleanClientSass,
    tasks.cleanClientStatic,
    tasks.cleanClientViews,
    // config
    tasks.cleanConfigEnv,
))
gulp.task('watch', gulp.series('clean', 'build', gulp.parallel(
    // main
    tasks.watchMainTypescript,
    tasks.watchMainResources,
    // test
    tasks.watchTestTypescript,
    tasks.watchTestResources,
    // client
    tasks.watchClientTypescript,
    tasks.watchClientSass,
    tasks.watchClientStatic,
    tasks.watchClientViews,
    // config
    tasks.watchConfigEnv,
)))
```

You could optionally tweak the built-in tasks as follows:

```typescript
const {sources} = require('gulpcommons')

sources.main.input = './src/main/typescript/**/*.ts'
sources.main.tsconfig = './src/main/typescript/tsconfig.json'
sources.main.output = './build/javascript/main'
```

Also, you could register all the tasks to gulp:

```typescript
const {tasks} = require('gulpcommons')

tasks.install()
```

Also, you can dynamically generate your custom tasks as follows:

```typescript
const gulp = require('gulp')
const {tasks, sources, generate, install} = require('gulpcommons')

// first define the sources
sources.mySourceSet = {
    myTypescript: {
        type: tasks.suites.typescript,
        input: './src/my-source-set/my-typescript/**/*.ts',
        output: './build/my-source-set/my-typescript',
        tsconfig: './src/my-source-set/my-typescript/tsconfig.json'
    },
    mySass: {
        type: tasks.suites.sass,
        input: './src/my-source-set/my-sass/**/*.sass',
        output: './build/my-source-set/my-sass'
    },
    myBundle: {
        type: tasks.suites.bundle,
        input: './src/my-source-set/my-bundle/**/*.*',
        output: './build/my-source-set/my-bundle'
    }
}

// then generate the tasks
generate()

// optional: register the tasks to gulp
install()

// finally add them to the build, clean and watch tasks
gulp.task('build', gulp.parallel(
    /* ... */
    tasks.compileMySourceSetMyTypescript,
    tasks.compileMySourceSetMySass,
    tasks.bundleMySourceSetMyBundle,
))
gulp.task('clean', gulp.parallel(
    /* ... */
    tasks.cleanMySourceSetMyTypescript,
    tasks.cleanMySourceSetMySass,
    tasks.cleanMySourceSetMyBundle,
))
gulp.task('watch', gulp.series('clean', 'build', gulp.parallel(
    /* ... */
    tasks.watchMySourceSetMyTypescript,
    tasks.watchMySourceSetMySass,
    tasks.watchMySourceSetMyBundle,
)))
```

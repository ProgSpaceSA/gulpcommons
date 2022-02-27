# Gulpcommons

Common gulp tasks repository/generator

### Built-in

This is an example gulpfile that uses the built-in tasks.

```typescript
const gulp = require('gulp')
const gulpcommons = require('gulpcommons')

gulp.task('build', gulp.parallel(
    // main
    gulpcommons.compileMainTypescript,
    gulpcommons.bundleMainResources,
    // test
    gulpcommons.compileTestTypescript,
    gulpcommons.bundleTestResources,
    // client
    gulpcommons.compileClientTypescript,
    gulpcommons.compileClientSass,
    gulpcommons.bundleClientStatic,
    gulpcommons.bundleClientViews,
    // config
    gulpcommons.bundleConfigEnv
))
gulp.task('clean', gulp.parallel(
    // main
    gulpcommons.cleanMainTypescript,
    gulpcommons.cleanMainResources,
    // test
    gulpcommons.cleanTestTypescript,
    gulpcommons.cleanTestResources,
    // client
    gulpcommons.cleanClientTypescript,
    gulpcommons.cleanClientSass,
    gulpcommons.cleanClientStatic,
    gulpcommons.cleanClientViews,
    // config
    gulpcommons.cleanConfigEnv,
))
gulp.task('watch', gulp.series('clean', 'build', gulp.parallel(
    // main
    gulpcommons.watchMainTypescript,
    gulpcommons.watchMainResources,
    // test
    gulpcommons.watchTestTypescript,
    gulpcommons.watchTestResources,
    // client
    gulpcommons.watchClientTypescript,
    gulpcommons.watchClientSass,
    gulpcommons.watchClientStatic,
    gulpcommons.watchClientViews,
    // config
    gulpcommons.watchConfigEnv,
)))
```

You could optionally tweak the built-in tasks as follows:

```typescript
const gulpcommons = require('gulpcommons')

gulpcommons.sources.main.input = './src/main/typescript/**/*.ts'
gulpcommons.sources.main.tsconfig = './src/main/typescript/tsconfig.json'
gulpcommons.sources.main.output = './build/javascript/main'
```

Also, you could register all the tasks to gulp:

```typescript
const gulpcommons = require('gulpcommons')

gulpcommons.install()
```

Also, you can dynamically generate your custom tasks as follows:

```typescript
const gulpcommons = require('gulpcommons')

// first define the sources
gulpcommons.sources.mySourceSet = {
    myTypescript: {
        type: gulpcommons.suites.typescript,
        input: './src/my-source-set/my-typescript/**/*.ts',
        output: './build/my-source-set/my-typescript',
        tsconfig: './src/my-source-set/my-typescript/tsconfig.json'
    },
    mySass: {
        type: gulpcommons.suites.sass,
        input: './src/my-source-set/my-sass/**/*.sass',
        output: './build/my-source-set/my-sass'
    },
    myBundle: {
        type: gulpcommons.suites.bundle,
        input: './src/my-source-set/my-bundle/**/*.*',
        output: './build/my-source-set/my-bundle'
    }
}

// then generate the tasks
gulpcommons.generate()

// optionally, register the tasks to gulp
gulpcommons.install()

// finally add them to the build, clean and watch tasks
gulp.task('build', gulp.parallel(
    /* ... */
    gulpcommons.compileMySourceSetMyTypescript,
    gulpcommons.compileMySourceSetMySass,
    gulpcommons.bundleMySourceSetMyBundle,
))
gulp.task('clean', gulp.parallel(
    /* ... */
    gulpcommons.cleanMySourceSetMyTypescript,
    gulpcommons.cleanMySourceSetMySass,
    gulpcommons.cleanMySourceSetMyBundle,
))
gulp.task('watch', gulp.series('clean', 'build', gulp.parallel(
    /* ... */
    gulpcommons.watchMySourceSetMyTypescript,
    gulpcommons.watchMySourceSetMySass,
    gulpcommons.watchMySourceSetMyBundle,
)))
```

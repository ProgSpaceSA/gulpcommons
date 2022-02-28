const gulp = require('gulp')

// Internal

const createFunction = <T>(definition: { [name: string]: T }): T => definition[Object.keys(definition)[0]];

// Exports

export type Source = {
    suite: Suite
    input: string | string[]
    output: string
    [config: string]: any
}

export type SourceSet = {
    [name: string]: Source
}

export type Task = () => any

export type Suite = (sourceSet: [string, SourceSet], source: [string, Source]) => [string, Task][]

export const sources: Record<string, SourceSet> = {}

export const tasks: Record<string, Task> = {}

export const suites: Record<string, Suite> = {}

export function generate() {
    for (const [ssn, ss] of Object.entries(sources))
        for (const [sn, s] of Object.entries(ss))
            for (const [tn, t] of s.suite([ssn, ss], [sn, s]))
                tasks[tn] = t
}

export function install() {
    for (const [tn, t] of Object.entries(tasks))
        gulp.task(tn, t)
}

// Defaults

suites.typescript = ([sourceSetName, sourceSet], [sourceName, source]) => {
    const sourceSetDisplayName = sourceSetName[0].toUpperCase() + sourceSetName.substring(1)
    const sourceDisplayName = sourceName[0].toUpperCase() + sourceName.substring(1)

    const compileTaskName = `compile${sourceSetDisplayName}${sourceDisplayName}`
    const cleanTaskName = `clean${sourceSetDisplayName}${sourceDisplayName}`
    const watchTaskName = `watch${sourceSetDisplayName}${sourceDisplayName}`

    const compileTask = createFunction({
        [compileTaskName]: () =>
            gulp.src(source.input, {allowEmpty: true})
                .pipe(require('gulp-typescript').createProject(source.tsconfig)())
                .pipe(gulp.dest(source.output))
    })
    const cleanTask = createFunction({
        [cleanTaskName]: () =>
            gulp.src(source.output, {allowEmpty: true})
                .pipe(require('gulp-clean')({read: false, force: true}))
    })
    const watchTask = createFunction({
        [watchTaskName]: () =>
            gulp.watch(source.input, gulp.series(
                cleanTask,
                compileTask
            ))
    })

    return [
        [compileTaskName, compileTask],
        [cleanTaskName, cleanTask],
        [watchTaskName, watchTask]
    ]
}
suites.sass = ([sourceSetName, sourceSet], [sourceName, source]) => {
    const sourceSetDisplayName = sourceSetName[0].toUpperCase() + sourceSetName.substring(1)
    const sourceDisplayName = sourceName[0].toUpperCase() + sourceName.substring(1)

    const compileTaskName = `compile${sourceSetDisplayName}${sourceDisplayName}`
    const cleanTaskName = `clean${sourceSetDisplayName}${sourceDisplayName}`
    const watchTaskName = `watch${sourceSetDisplayName}${sourceDisplayName}`

    const compileTask = createFunction({
        [compileTaskName]: () => {
            const gulpSass = require('gulp-sass')(require('sass'))

            return gulp.src(source.input, {allowEmpty: true})
                .pipe(gulpSass().on('error', gulpSass.logError))
                .pipe(gulp.dest(source.output))
        }
    })
    const cleanTask = createFunction({
        [cleanTaskName]: () =>
            gulp.src(source.output, {allowEmpty: true})
                .pipe(require('gulp-clean')({read: false, force: true}))
    })
    const watchTask = createFunction({
        [watchTaskName]: () =>
            gulp.watch(source.input, gulp.series(
                cleanTask,
                compileTask
            ))
    })

    return [
        [compileTaskName, compileTask],
        [cleanTaskName, cleanTask],
        [watchTaskName, watchTask]
    ]
}
suites.bundle = ([sourceSetName, sourceSet], [sourceName, source]) => {
    const sourceSetDisplayName = sourceSetName[0].toUpperCase() + sourceSetName.substring(1)
    const sourceDisplayName = sourceName[0].toUpperCase() + sourceName.substring(1)

    const compileTaskName = `bundle${sourceSetDisplayName}${sourceDisplayName}`
    const cleanTaskName = `clean${sourceSetDisplayName}${sourceDisplayName}`
    const watchTaskName = `watch${sourceSetDisplayName}${sourceDisplayName}`

    const compileTask = createFunction({
        [compileTaskName]: () =>
            gulp.src(source.input, {allowEmpty: true})
                .pipe(gulp.dest(source.output))
    })
    const cleanTask = createFunction({
        [cleanTaskName]: () =>
            gulp.src(source.output, {allowEmpty: true})
                .pipe(require('gulp-clean')({read: false, force: true}))
    })
    const watchTask = createFunction({
        [watchTaskName]: () =>
            gulp.watch(source.input, gulp.series(
                cleanTask,
                compileTask
            ))
    })

    return [
        [compileTaskName, compileTask],
        [cleanTaskName, cleanTask],
        [watchTaskName, watchTask]
    ]
}

sources.main = {
    typescript: {
        suite: suites.typescript,
        input: ['./src/main/typescript/**/*.ts'],
        output: './build/javascript/main',
        tsconfig: './src/main/typescript/tsconfig.json'
    },
    resources: {
        suite: suites.bundle,
        input: ['./src/main/resources/**/*.*'],
        output: './build/bundle/main/resources',
    }
}
sources.test = {
    typescript: {
        suite: suites.typescript,
        input: ['./src/test/typescript/**/*.ts'],
        output: './build/javascript/test',
        tsconfig: './src/test/typescript/tsconfig.json'
    },
    resources: {
        suite: suites.bundle,
        input: ['./src/test/resources/**/*.*'],
        output: './build/bundle/test/resources/**/*.*',
    }
}
sources.client = {
    typescript: {
        suite: suites.typescript,
        input: ['./src/client/typescript/**/*.ts'],
        output: './build/javascript/client',
        tsconfig: './src/client/typescript/tsconfig.json'
    },
    sass: {
        suite: suites.sass,
        input: ['./src/client/sass/**/*.sass'],
        output: './build/css/client'
    },
    views: {
        suite: suites.bundle,
        input: ['./src/client/views/**/*.*'],
        output: './build/bundle/client/views',
    },
    static: {
        suite: suites.bundle,
        input: ['./src/client/static/**/*.*'],
        output: './build/bundle/client/static',
    }
}
sources.config = {
    env: {
        suite: suites.bundle,
        input: ['.env', '.default.env'],
        output: './build/bundle/config'
    }
}

generate()

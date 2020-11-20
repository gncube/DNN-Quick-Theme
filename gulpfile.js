const { series, src, dest } = require('gulp');

var rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    replace = require('gulp-replace'),
    zip = require('gulp-zip'),
    clean = require('gulp-clean'),
    details = require('./project-details.json'),
    project = details.project,
    version = details.version,
    author = details.author,
    company = details.company,
    url = details.url,
    email = details.email,
    description = details.description;


var paths = {
    projectdetails: {
        src: './project-details.json'
    },
    fonts: {
        src: './src/fonts/*',
        dest: './dist/fonts/'
    },
    faFonts: {
        src: './node_modules/@fortawesome/fontawesome-free/webfonts/*',
        dest: './dist/webfonts/'
    },
    faCss: {
        src: './node_modules/@fortawesome/fontawesome-free/css/all.min.css',
        dest: './dist/css/'
    },
    slimMenu: {
        src: './src/assets/jquery.slimmenu.min.js',
        dest: './dist/js/'
    },
    normalize: {
        src: './node_modules/normalize.css/normalize.css',
        dest: './dist/css/'
    },
    bsJs: {
        src: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.*',
        dest: './dist/js/'
    },
    images: {
        src: './src/images/**/*.{jpg,jpeg,png,gif,svg}',
        dest: './dist/images/'
    },
    styles: {
        src: './src/scss/**/*.scss',
        dest: './dist/css/'
    },
    scripts: {
        src: './src/js/*.js',
        dest: './dist/js/'
    },
    containers: {
        src: '../../Containers/' + company + '.' + project + '/*',
        //dest: '../../../../Install/' + project + 'ThemePackage/' + project + 'Containers/'
        dest: './dist/containers/'
    },
    manifest: {
        src: './manifest.dnn',
        dest: './'
    },
    skins: {
        src: [
            'assets/**/*',
            'custom/**/*',
            'menus/**/*',
            'partials/**/*',
            './*.{ascx,jpg,png,PNG,xml,dnn}',
        ],
        //dest: '../../../../Install/' + project + 'ThemePackage/' + project + 'Skins/'
        dest: './dist/skins/'
    },
    zipdist: {
        src: 'dist/**/*',
        zipfile: 'dist.zip',
        dest: './temp/'
    },
    zipskins: {
        src: 'dist/skins/**/*',
        //zipfile: 'dist.zip',
        zipfile: company + '.' + project + 'Skins.zip',
        dest: './temp/'
    },
    zipcontainers: {
        src: 'dist/containers/**/*',
        //zipfile: 'cont.zip',
        zipfile: company + '.' + project + 'Containers.zip',
        dest: './temp/'
    },
    zipelse: {
        src: ['./menus/**/*', './partials/*', '*.{ascx,xml,html,htm}'],
        zipfile: 'else.zip',
        dest: './temp/'
    },
    zippackage: {
        //src: ['./temp/*.zip', '*.{dnn,png,jpg,txt}', 'LICENSE'],
        src: ['./temp/*.zip', 'License.txt', 'ReleaseNotes.txt', 'manifest.dnn'],
        //src: './temp/*.zip',
        zipfile: company + '.' + project + '\_' + version + '\_install.zip',
        //dest: './build/'
        dest: '../../../../Install/Skin/'
    },
    cleanup: {
        src: './temp/'
    }
};


// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
    // body omitted
    cb();
}


/*------------------------------------------------------*/
/* DNN TASKS -------------------------------------------*/
/*------------------------------------------------------*/
// Copy containers to proper DNN theme containers folder
function containers() {
    return src(paths.containers.src)
        .pipe(dest(paths.containers.dest))
        .pipe(notify({ message: '<%= file.relative %> distributed!', title: 'containers', sound: false }));
}

// Update manifest.dnn
function manifest() {
    return src(paths.manifest.src)
        .pipe(replace(/\<package name\=\"(.*?)(?=\")/, '<package name="' + company + '.' + project))
        .pipe(replace(/type\=\"Skin\" version\=\"(.*?)(?=\")/, 'type="Skin" version="' + version))
        .pipe(replace(/\<friendlyName\>(.*?)(?=\<)/, '<friendlyName>' + company + '.' + project))
        .pipe(replace(/\<description\>(.*?)(?=\<)/, '<description>' + description))
        .pipe(replace(/\<name\>(.*?)(?=\<)/, '<name>' + author))
        .pipe(replace(/\<organization\>(.*?)(?=\<)/, '<organization>' + company))
        .pipe(replace(/\<url\>(.*?)(?=\<)/, '<url>' + url))
        .pipe(replace(/\<email\>(.*?)(?=\<)/, '<email>' + email))
        .pipe(replace(/\<skinName\>(.*?)(?=\<)/, '<skinName>' + company + '.' + project))
        .pipe(replace(/(\\Skins\\)(.*?)(?=\\)/g, '\\Skins\\' + company + '.' + project))

        .pipe(replace(/\<package name\=\"(.*?)(?=\")/, '<package name="' + company + '.' + project))
        .pipe(replace(/type\=\"Container\" version\=\"(.*?)(?=\")/, 'type="Container" version="' + version))
        .pipe(replace(/\<friendlyName\>(.*?)(?=\<)/, '<friendlyName>' + company + '.' + project))
        .pipe(replace(/\<description\>(.*?)(?=\<)/, '<description>' + description))
        .pipe(replace(/\<name\>(.*?)(?=\<)/, '<name>' + author))
        .pipe(replace(/\<organization\>(.*?)(?=\<)/, '<organization>' + company))
        .pipe(replace(/\<url\>(.*?)(?=\<)/, '<url>' + url))
        .pipe(replace(/\<email\>(.*?)(?=\<)/, '<email>' + email))
        .pipe(replace(/\<containerName\>(.*?)(?=\<)/, '<containerName>' + company + '.' + project))
        .pipe(replace(/(\\Containers\\)(.*?)(?=\\)/g, '\\Containers\\' + company + '.' + project))

        .pipe(dest(paths.manifest.dest))
        .pipe(notify({ message: '<%= file.relative %> updated!', title: 'manifest', sound: false }));
}

function skins() {
    return src(paths.skins.src, { "base": "." })
        .pipe(dest(paths.skins.dest))
        .pipe(notify({ message: '<%= file.relative %> distributed!', title: 'skins', sound: false }));
}

/*------------------------------------------------------*/
/* END DNN TASKS ---------------------------------------*/
/*------------------------------------------------------*/



// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function copySkins() {
    return src([
        'assets/**/*',
        'custom/**/*',
        'menus/**/*',
        'partials/**/*',
        './**/*.{ascx,jpg,png,xml}',
    ],
        { "base": "." })
        .pipe(dest('../../../../Install/Skin/' + company + '.' + project + 'ThemePackage/' + company + '.' + project + 'Skins'));
}

function copyContainers() {
    return src([
        '../../Containers/' + company + '.' + project + '/*.{ascx,jpg,png}'

    ])
        .pipe(dest('../../../../Install/Skin/' + company + '.' + project + 'ThemePackage/' + company + '.' + project + 'Containers'));
}



/*------------------------------------------------------*/
/* PACKAGING TASKS -------------------------------------*/
/*------------------------------------------------------*/
// ZIP contents of dist folder
function zipskins() {
    return src(paths.zipskins.src)
        .pipe(zip(paths.zipskins.zipfile))
        .pipe(dest(paths.zipskins.dest))
        .pipe(notify({ message: '<%= file.relative %> temporarily created!', title: 'zipskins', sound: false }));
}

// ZIP contents of containers folder
function zipcontainers() {
    return src(paths.zipcontainers.src)
        .pipe(zip(paths.zipcontainers.zipfile))
        .pipe(dest(paths.zipcontainers.dest))
        .pipe(notify({ message: '<%= file.relative %> temporarily created!', title: 'zipcontainers', sound: false }));
}


// git ziptemp
var ziptemp = series(zipskins, zipcontainers);

// Assemble files into DNN theme install package
function zippackage() {
    return src(paths.zippackage.src)
        .pipe(zip(paths.zippackage.zipfile))
        .pipe(dest(paths.zippackage.dest))
        .pipe(notify({ message: '<%= file.relative %> created!', title: 'zippackage', sound: false }));
}

// Cleanup temp folder
function cleanup() {
    return src(paths.cleanup.src)
        .pipe(clean())
        .pipe(notify({ message: 'temp folder cleaned up!', title: 'cleanup', sound: false }));
}
/*------------------------------------------------------*/
/* END PACKAGING TASKS ---------------------------------*/
/*------------------------------------------------------*/


/*
exports.build = copySkins;
exports.build = copyContainers;
exports.default = series(clean, copySkins, copyContainers);
*/


/*------------------------------------------------------*/
/* EXPORT TASKS ----------------------------------------*/
/*------------------------------------------------------*/
// You can use CommonJS `exports` module notation to declare tasks
/*exports.fontsInit = fontsInit;
exports.faFontsInit = faFontsInit;
exports.faCssInit = faCssInit;
exports.slimMenuInit = slimMenuInit;
exports.normalizeInit = normalizeInit;
exports.bsCssInit = bsCssInit;
exports.bsJsInit = bsJsInit;
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;*/
exports.containers = containers;
exports.manifest = manifest;
exports.skins = skins;
exports.zipskins = zipskins;
exports.zipcontainers = zipcontainers;
//exports.zipelse = zipelse;
//exports.ziptemp = ziptemp;
exports.zippackage = zippackage;
exports.cleanup = cleanup;
//exports.serve = serve;
//exports.watch = watch;
//exports.init = init;*/
//exports.build = build;
//exports.package = package;

// Define default task that can be called by just running `gulp` from cli
exports.default = series(containers, manifest, skins, zipskins, zipcontainers, zippackage, cleanup);
/*------------------------------------------------------*/
/* END EXPORT TASKS ------------------------------------*/
/*------------------------------------------------------*/

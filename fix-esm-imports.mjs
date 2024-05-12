#!/usr/bin/node
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

/*
    this script fixes the ES Module by giving imports/exports a '.js' extension
    very good for TypeScript projects with ES Module compiling 👍
*/

const path = process.argv[2] // we need da path to the folder
if(typeof path != "string")
{
    // say f**k to the user
    console.info("Usage: node fix-esm-imports.mjs <dist-folder>")
    process.exit(1)
}
// get the path to the dist based on the current working directory
const dist = resolve(process.cwd(),path)

/**
 * reads all handles in `dir` and only retrieves the full path to files, recursivly
 * @param {string} dir the folder to scan
 * @returns {Array<string>} a array of string full path to files
 */
function get_files(dir)
{
    /** @type {Array<string>} */
    const files = []
    const dirents = readdirSync(dir,{withFileTypes: true})
    for(const dirent of dirents)
    {
        const fullpath = resolve(dirent.path,dirent.name)
        if(dirent.isFile())
        {
            files.push(fullpath)
            continue
        }
        if(dirent.isDirectory())
        {
            files.push(...get_files(fullpath))
            continue
        }
    }
    return files
}

/**
 * gets the path from the import/export `line`
 * @param {string} line 
 * @returns {string}
 * @throws no
 */
function get_path(line)
{
    if(line.indexOf('"') + line.lastIndexOf('"') >= 0)
        return line.substring(line.indexOf('"')+1,line.lastIndexOf('"'))
    if(line.indexOf("'") + line.lastIndexOf("'") >= 0)
        return line.substring(line.indexOf("'")+1,line.lastIndexOf("'"))
    throw "no"
}

/**
 * fixes the import/export statement with the real file path
 * @param {string} line the import/export line statement
 * @param {string} file the path to the file with the import/export statement
 * @returns {string} the fixed path or not
 */
function fix_path(line,file)
{
    const path = get_path(line)
    // this fixes everything
    const fixed_path = path + ".js"
    // get the full file path
    const fullpath = resolve(dirname(file),fixed_path)
    // return just the line if it's a module from a package manager
    if(!existsSync(fullpath)) return line
    // fix that part
    return line.replaceAll(path,fixed_path)
}

/**
 * fix `file` and all its import/export statements
 * @param {string} file the file to fix
 */
function fix_file(file)
{
    // read the file fully
    let content = readFileSync(file,"utf-8")
    // split the files by lines
    const lines = content.split("\n")
    const imports = lines // get all the imports
    .filter((line) => line.startsWith("import"))
    // fix all the imports
    const fixedImports = imports.map((imp) => fix_path(imp,file))
    const exports = lines // get all the exports
    .filter((line) => line.startsWith("export") && line.includes("from") && (line.endsWith('";') || line.endsWith('"')))
    // fix all the exports
    const fixedExports = exports.map((exp) => fix_path(exp,file))
    // if no fixes are required, then there's nothing to do
    if(imports.length + exports.length == 0) return
    // go through each import/export and fix it
    for(let i = 0;i < fixedImports.length;i++)
        content = content.replace(imports[i],fixedImports[i])
    for(let i = 0;i < fixedExports.length;i++)
        content = content.replace(exports[i],fixedExports[i])
    // finally write the fixed content back to the file
    writeFileSync(file,content,"utf-8")
}

// get all files that end with the '.js' extension
const files = get_files(dist).filter((file) => file.endsWith(".js"))
// fix every file
files.forEach(fix_file)
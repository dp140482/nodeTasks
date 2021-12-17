#!/usr/local/bin/node
const fs = require("fs");
const inquirer = require("inquirer");
const pth = require("path");

const { string } = require("yargs");
const yargs = require("yargs");

const path = process.cwd();

const options = yargs
    .usage("Usage: -p <path to directory or file>")
    .options("p", {
        alias: "path",
        describe: "Path to directory or file",
        type: string,
        demandOption: false
    })
    .options("s", {
        alias: "search",
        describe: "Phrase to search",
        type: string,
        demandOption: false
    })
    .argv;

if (options.path) {
    path = options.path;
}

const showFileContent = file => {
    const data = fs.readFileSync(file, "utf-8");
    if (!options.search)
        console.log(data);
    else if (data.includes(options.search)) {
        const res = Array.from(data.matchAll(options.search));
        console.log(`There is ${res.length} entries of the phrase in this text.`);
    }
}

const showFileOrDir = path => {
    if (fs.lstatSync(path).isFile())
        showFileContent(path);
    else {
        const fileList = fs.readdirSync(path);
        inquirer.prompt([{
            name: "filename",
            type: "list",
            message: "Choose a file to view it's content",
            choices: fileList
        }])
        .then(
            answer => showFileOrDir(
                pth.join(path, answer.filename)
            )
        );
    }
};

showFileOrDir(path);
const fs = require('fs');
const ExifReader = require('exifreader')
const XML = require('xml')

const imageFolder = "./images/";

var numImages = 0;
var numParsed = 0;
var output = {"data":[]};

async function loadImageData ( index, filename) {

    var tags = await ExifReader.load( imageFolder + filename );
    output.data[ index ] = {
        "path": "img/" + filename,
        "datetime": tags.DateTime.description,
        "lens": tags.Lens.value
    }
    
    numParsed++;
    if( numParsed == numImages )
    {
        exportData();
    }
}

function exportData()
{

    // export json
    fs.writeFileSync( "build/data.json", JSON.stringify( output, null, 2 ) );

    // build and export RSS
    createRSSFeed();

}

function createRSSFeed()
{
    const feedData = {
        rss: [
            {
                _attr: {
                    version: "2.0",
                    "xmlns:atom": "http://www.w3.org/2005/Atom",
                }
            },
            {
                channel: [
                    {
                        "atom:link": {
                            _attr: {
                                href: "http://snaps.markdooney.com/feed.rss",
                                rel: "self",
                                type: "application/rss+xml",
                            },
                        },
                    },
                    {
                        title: "snaps.markdooney.com",
                    },
                    {
                        link: "http://snaps.markdooney.com",
                    },
                    { 
                        description: "I sometimes take photos." 
                    },
                    { 
                        language: "en-gb" 
                    },
                    {
                        copyright: "Copyright 2025, Mark Dooney"
                    },
                    getRSSPostData()
                ],
            }
        ]
    }

    console.log(feedData);

    const feed = '<?xml version="1.0" encoding="UTF-8"?>' + XML( feedData );

    fs.writeFileSync("build/feed.rss", feed, "utf8");

}


function getRSSPostData()
{

    let data = [];

    for( let i = output.data.length-1; i >= 0; i-- )
    {

        let num = i.toString();
        while( num.length < 4 )
            num = "0"+num
        
        let post = {
            item:[
                { title: "Snap " + num },
                { link: "http://snaps.markdooney.com/view.html?index="+i}
            ]
        };

        data.push( post );

    }

    return { data };

}


function copyImageToBuildFolder( file )
{

    fs.copyFile( imageFolder + file, "./build/img/" + file, ( err ) => {

        if( err ) throw err;
        // console.log( file + " was copied to ./build/img/" );

    });

}

function createBuildFolders()
{

    if( !fs.existsSync( "./build" ) )
        fs.mkdirSync( "./build" )
    
    if( !fs.existsSync( "./build/img" ) )
        fs.mkdirSync( "./build/img" )

}

function copySourceFilesToBuildFolder()
{

    fs.readdir( "./src/", ( err, files ) => {
        
        if( err ) throw err;

        var numFiles = files.length;

        for( var i = 0; i < numFiles; i++ )
        {
            
            fs.copyFile( "./src/" + files[i], "./build/" + files[i], ( error ) => {
                if( error ) throw error;
                // console.log( files[i] + " copied to ./build/" );
            });

        }

    });

}

function buildSite()
{

    createBuildFolders();

    fs.readdir( imageFolder, ( err, files ) => {

        numImages = files.length;
    
        for( var i = 0; i < numImages; i++ )
        {
            
            copyImageToBuildFolder( files[i] );
            loadImageData( i, files[i] );

        }

    });

    copySourceFilesToBuildFolder();

}


buildSite();

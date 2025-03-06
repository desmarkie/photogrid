function init()
{

    fetch( "./data.json" )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            buildDOM( data.data );
        })
        .catch( ( error ) => {
            console.error( "Error Fetching JSON File:", error );
        });

}

function buildDOM( images )
{

    let content = document.createElement( "div" );
    var filepath = "img/";

    const urlParams = new URLSearchParams(window.location.search);

    if( urlParams.has( 'index' ) )
    {
        
        var id = urlParams.get( 'index' );
        var num = id.toString();
        while( num.length < 3 )
        {
            num = "0" + num;
        }

        filepath += num + ".jpg";

        var img = document.createElement( "img" );
        img.src = filepath;
        img.className = "view";
        content.appendChild( img );

        let txt = document.createElement( "p" );
        txt.innerText = images[id].datetime + "\n" + images[id].lens;
        content.appendChild( txt );

    }
    else
    {

        let imageCount = images.length;

        for( var i = imageCount-1; i >= 0; i-- )
        {
            
            filepath = "img/";
            var num = ( i + 1 ).toString();
            while( num.length < 3 )
            {
                num = "0"+num;
            }
            filepath += num + ".jpg"

            var img = document.createElement( "img" );
            img.src = filepath;
            content.appendChild( img );

        }

    }

    document.body.appendChild( content );

}
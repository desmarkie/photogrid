function init()
{
    
    let imageCount = 10;
    
    let content = document.createElement( "div" );

    for( var i = imageCount-1; i >= 0; i-- )
    {
    
        var filepath = "images/";
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

    document.body.appendChild( content );

}
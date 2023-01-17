const deepai = require('deepai');

deepai.setApiKey('quickstart-QUdJIGlzIGNvbWluZy4uLi4K') //This key free (untested)

//pass text to AI model

var result = await deepai.callStandardApi("sentiment-analysis", {text:"Image of a Crazy Bee!",});

    //TODO
//retreive prompt from front end 
//post result to front end by calling into an existing HTML element, such as a div, with the id "yourResultContainerId".
//https://github.com/deepai-org/deepai-js-client
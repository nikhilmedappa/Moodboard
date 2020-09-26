document.addEventListener('DOMContentLoaded', function () {

    var bg = chrome.extension.getBackgroundPage();
    var images = bg.images;
   $.each(images, function(index, value) {
        var upload = uploadMaker(index, value);
        $('uploads').append(upload);
    });
function uploadMaker(nr, url) {
        var container = document.createElement('upload');

        var img = document.createElement('div');
        img.className = 'imgwrap';
        $(img).attr('style', ('background-image: url(' + url + ')'));

        var textContainer = document.createElement('div');
        textContainer.className = 'textwrap';
        var formContainer = document.createElement('form');
        $(formContainer).attr('action', 'api.some_api_endpoint.com');
        $(formContainer).attr('method', 'post');
        formContainer.id = 'form-' + nr

        formContainer.appendChild( tagsInputMaker('tags', 'TAGS', "") );
        formContainer.appendChild( inputMaker('source', 'SOURCE', url) );
        formContainer.appendChild( hiddenInputMaker('imageurl', url) );
        formContainer.appendChild( hiddenInputMaker('api_key', 'fizzbuzz') );
        formContainer.appendChild( submitButtonMaker('Send', 'submit'));
        formContainer.appendChild( buttonMaker('Remove this image from list', 'removeImage'));
        textContainer.appendChild( formContainer );

        container.appendChild(img);
        container.appendChild(textContainer);
        return container;
    };

    function tagsInputMaker(name, label, content) {
        var inputWrap = document.createElement('div');
        inputWrap.className = 'field';

        var inputLabel = document.createElement('label');
        inputLabel.innerHTML = label;

        var mostUsedTags = ['poster', 'graphic design', 'black and white'].split(",");
        var i;
        var tagsArray = [];
        for (i = 0; i < mostUsedTags.length; ++i) {
            var value = mostUsedTags[i]; 
            var tag = document.createElement('span');
            tag.innerHTML = value;
            tag.className = "clickable-tag";
            tag.id = "clickable-tag";
            tagsArray.push(tag.outerHTML);
        }

        var tags = document.createElement('tags');
        tags.innerHTML = tagsArray.join("");

        var inputField = document.createElement('input');
        inputField.value = content;
        $(inputField).attr('name', name);
        $(inputField).attr('type', 'text');

        inputWrap.appendChild(inputLabel);
        inputWrap.appendChild(tags);
        inputWrap.appendChild(inputField);
        return inputWrap;
    };

    function buttonMaker(buttonText, type) {
        var button = document.createElement('button');
        button.innerHTML = buttonText;
        $(button).attr('type', type);
        return button;
    };

    function submitButtonMaker(value, type) {
        var inputSubmit = document.createElement('input');
        $(inputSubmit).attr('value', value);
        $(inputSubmit).attr('type', type);
        return inputSubmit;
    };

    function hiddenInputMaker(name, url) {
        var inputField = document.createElement('input');
        $(inputField).attr('type', 'hidden');
        $(inputField).attr('name', name);
        $(inputField).attr('value', url);
        return inputField;
    };

    function inputMaker(name, label, content) {
        var inputWrap = document.createElement('div');
        inputWrap.className = 'field';

        var inputLabel = document.createElement('label');
        inputLabel.innerHTML = label;

        var inputField = document.createElement('input');
        inputField.value = content;
        $(inputField).attr('name', name);
        $(inputField).attr('type', 'text');

        inputWrap.appendChild(inputLabel);
        inputWrap.appendChild(inputField);
        return inputWrap;
    };
  function findImageUrlFromForm(form) {
        var imageUrl = form
            .serializeArray()
            .filter(function(x) { return x.name === "imageurl"})[0].value;
        return imageUrl;
    };

 function removeImageFromBackground(url) {
        // send removal message to main.js
        chrome.runtime.sendMessage({urlToRemove: url}, function(response) {
            // append the returned message at the top of popup.html
            displayMessage(response.message, 'fadeOut');
        });
    };
     $('button[type="removeImage"]').click( function(e) {
        e.preventDefault();
        // remove from popup.html
        $(this.parentNode).parent().parent().remove();
        // remove from background.js
        var imageUrl = findImageUrlFromForm( $(this.parentNode) );
        removeImageFromBackground(imageUrl);
    });
 });
 
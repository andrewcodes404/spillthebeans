tinymce.init({
  selector: '#tiny_editor',
  theme: 'modern',
  width: 700,
  height: 300,
  content_css: '/dist/style.css',
  plugins: [
    'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker', 'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
   'save table contextmenu directionality emoticons template paste textcolor'
      ],

    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | code',

  // enable title field in the Image dialog
  image_title: true,
  // enable automatic uploads of images represented by blob or data URIs
  automatic_uploads: true,
  // add custom filepicker only to Image dialog
  file_picker_types: 'image',
  file_picker_callback: function(cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file', 'class');
    input.setAttribute('accept', 'image/*');
    // input.classList.add("anotherclass")
    input.onchange = function() {
      var file = this.files[0];
      var reader = new FileReader();

      reader.onload = function () {
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);


        // call the callback and populate the Title field with the file name
        cb(blobInfo.blobUri(), { title: file.name, class : 'blob'});
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }
});

function slideonlyone(thechosenone) {
     $('div[name|="newboxes2"]').each(function(index) {
          if ($(this).attr("id") == thechosenone) {
               $(this).slideDown(800);
          }
          else {
               $(this).slideUp(800);
          }
     });
}
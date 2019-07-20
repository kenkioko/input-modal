$(function() {
  /**
   * Back-end Server Host URL
   */
  var host = 'http://127.0.0.1:8000';

  /*
   * logo text to be passed to the server
   */
  var logo_text = {
    category: '',
    line_1:'',
    line_2:'',
    type: ''
  };

  /*
   * available fonts to be shown on the cards and can be chosen
   */
  var logo_fonts = [];

  /*
   * available logos to be shown on the cards and can be chosen
   */
  var logo_types = [];

  /*
   * the card top image as a vue component
   *
   * use one of the two lines
   */
  Vue.component('card-img', {
    template: '#card-img-template'  /* uncomment this line for images */
    //template: `<i class="fas fa-image fa-7x"></i>` /* uncomment this line for sample */
  });

  /*
   * the modal card as a vue component
   */
  Vue.component('modal-card', {
    props: ['item', 'type'],
    data: function () {
      return {
        selected: false
      }
    },
    methods: {
      select: function (item, type) {
        this.selected = true;
        if (type == 'font') {
          selected.fonts.push(item.id);
        } else if (type == 'logo') {
          selected.logos.push(item.id);
        }
      },
      remove: function (item, type) {
        this.selected = false;
        if (type == 'font') {
          var index = selected.fonts.findIndex(function (element) {
            return element === item.id;
          });
          
          selected.fonts.splice(index, 1);
        } else if (type == 'logo') {
          var index = selected.logos.findIndex(function (element) {
            return element === item.id;
          });
          
          selected.logos.splice(index, 1);
        }
      },
    },
    template: '#modal-card-template',
  });

  /*
   * vue instances for different modals
   */
  var logo_text_app = new Vue({ 
    el: '#text-data',
    data: logo_text
  });

  var font_items_app = new Vue({ 
    el: '#font-items',
    data: {
      fonts: logo_fonts,
      type: 'font'
    }
  });

  var logo_items_app = new Vue({ 
    el: '#logo-items',
    data: {
      logos: logo_types,
      type: 'logo'
    }
  });

  /*
   * Selected fonts and logo types
   */
  var selected = {
    fonts: [],
    logos: []
  };  
  
  /*
   * get the form data to be passed to the server
   */
  function get_data() {
    return {
      logo_text: JSON.stringify(logo_text),
      font_type: JSON.stringify(selected.fonts),
      logo_type: JSON.stringify(selected.logos),
    }
  }
  
  /*
   * submit the form data to the server
   */
  function submit_data() {
    $.ajax({
      url: host + "/api/logos.php",
      data: get_data(),
      dataType: 'json',
      method: 'POST',
    }).done(function(response, status) {
      success_response(response, status)
    }).fail(function (response, status) {
      fail_response(response, status);
    });
  }  
  
  function get_categories() {
    $.ajax({
      url: host + "/api/categories.php",
      dataType: 'json',
      method: 'GET',
    }).done(function(response, status) {
      $.each( response, function( index, value ) {
        set_categories( index, value );
      });
    }).fail(function (response, status) {
      fail_response(response, status);
    });
  }
  
  function set_categories(index, category) {
    var select = document.getElementById('category-input');
    var opt = document.createElement('option');
    opt.value = category.id;
    opt.textContent = category.category;            
    select.appendChild(opt);
  }
  
  function get_items() {
    $.ajax({
      url: host + "/api/items.php",
      dataType: 'json',
      method: 'GET',
    }).done(function(response, status) {
      $.each( response, function( index, value ) {
        if (value.type == 'logo') {
          set_logos( index, value );
        } else if (value.type == 'font') {
          set_fonts( index, value );
        }
      });
    }).fail(function (response, status) {
      fail_response(response, status);
    });
  }
  
  function set_logos(index, logo) {
    logo_types.push(logo);
  }
  
  function set_fonts(index, font) {
    logo_fonts.push(font);
  }    
  
  function get_logo_data() {
    $.ajax({
      url: host + "/api/logos.php",
      dataType: 'json',
      method: 'GET',
    }).done(function(response, status) {
      success_response(response, status)
      
      $.each( response, function( index, value ) {
        display_logo_data(index, value);
      });
    }).fail(function (response, status) {
      fail_response(response, status);
    });
  }
  
  function display_logo_data(index, row) {
    var tr = document.createElement('tr');
    //id col
    var td_id = document.createElement('td');
    td_id.textContent = row.id;
    tr.appendChild(td_id);
    //category col
    var td_category = document.createElement('td');
    td_category.textContent = row.category.category;
    tr.appendChild(td_category);
    //line 1 col
    var td_line_1 = document.createElement('td');
    td_line_1.textContent = row.line_1;
    tr.appendChild(td_line_1);
    //line 2 col
    var td_line_2 = document.createElement('td');
    td_line_2.textContent = row.line_2;
    tr.appendChild(td_line_2);
    //type col
    var td_type = document.createElement('td');
    td_type.textContent = row.type;
    tr.appendChild(td_type);
    
    var font = '', logo = '';
    $.each( row.logo_items, function( index, value ) {
      if(value.type == 'font'){
        if(font.trim() !== '') {font += ', '}
        
        font += value.name;
      } else if(value.type == 'logo'){
        if(logo.trim() !== '') {logo += ', '}
        
        logo += value.name;
      }
    });
    
    //font col
    var td_font= document.createElement('td');
    td_font.textContent = font;
    tr.appendChild(td_font);
    //logo col
    var td_logo = document.createElement('td');
    td_logo.textContent = logo;
    tr.appendChild(td_logo);
    
    document.getElementById('logo-data-table').appendChild(tr);
  }
  
  function success_response(response, status) {
    console.log('response: ', response);
    console.log('status: ', status);
    
    $('#server-status').text(status)
                      .addClass('text-success')
                      .removeClass('text-danger');
                      
    $('#server-message').text('Sever responded with success');
    $('#server-data').text(
      JSON.stringify(response, null, 2)
    );
  }
  
  function fail_response(response, status) {
    console.log('response: ', response);
    console.log('responseJSON: ', response.responseJSON);
    console.log('status: ', status);
    
    $('#server-status').text(status + ' [code=' + response.status + ']')
                      .addClass('text-danger')
                      .removeClass('text-success');
                      
    $('#server-message').text(response.responseJSON.message);
    $('#server-data').text(
      JSON.stringify(response.responseJSON, null, 2)
    );
  }
  
  /**
   * function triggers
   */
  get_items();
  get_categories();
  
  $('#submit-data').click(function () {
    submit_data();
  });
  
  $('#get-data').click(function () {
    get_logo_data();
  });
});


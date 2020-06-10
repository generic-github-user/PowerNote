var testdata = '\
inheritors\
\nsolvency\
\nmalfeasance\
\n\
\nconcomitant\
\nglass castle\
\ndiminutive\
\ncommissary\
\nlapidary\
\ncatchetism\
\nsurreptitious\
\npreeminent\
\ndissonance\
\npretense\
\nhaberdashery\
\nfallow\
\nlugubrious\
\ncantankerous\
\n\
\nnon sequiturs\
\nmalfeasance\
\n\
\nconcomitant\
\nglass castle\
\ndiminutive\
\ncommissary\
\nlapidary\
\ncatchetism\
\nsurreptitious\
\npreeminent\
\naplomb\
\nslovenly\
\nsupple\
\nvicariously\
\nlaconic\
\nattuned\
\ntact\
\nzany\
\nmotile\
\nexigence';

function generate_id() {
      return Math.floor(Math.random() * 1e16).toString(16)
}

if (localStorage.getItem('powernote_data-notes') == null) {
      notes = [];
      // Load test data
      notes = testdata.split('\n');
} else {
      notes = JSON.parse(localStorage.getItem('powernote_data-notes'));
}
groups = [];
event_chain = [];

notes.forEach((note) => {
      $('#notes-panel').append(load_note(note));
})

function sync() {
      notes = note_elements_to_array($('li'));
      localStorage.setItem('powernote_data-notes', JSON.stringify(notes));
}

// sortable.on($('#notes-panel')[0],'onEnd',(e)=>{console.log(e)})
// Sortable.utils.on($('#notes-panel').children()[0],'onStart',(events)=>{console.log(true)})

// Record a user action or Sortable.js event
function record_event(event) {
      event_chain.push({
            'time': new Date().getTime(),
            'event': event
      });
}

// Load a note element
function load_note(text) {
      element = $('<li type="button" class="list-group-item list-group-item-action">Lorem ipsum</li>');
      element.text(text);
      return element;
}

// Convert list of note elements to an array of their contents
function note_elements_to_array(selection) {
      note_list = [];
      for (var i = 0; i < selection.length; i++) {
            note_list.push(selection[i].innerText);
      }
      return note_list;
}

// Replace a list of selected notes with another, even better, list
function replace_note_elements(selection, sorted_list) {
      for (var i = 0; i < sorted_list.length; i++) {
            item = load_note(sorted_list[i]);
            item.insertBefore(selection[0]);
            Sortable.utils.select(item[0]);
      }
      for (var i = 0; i < selection.length; i++) {
            selection[i].remove()
      }
}

function update_single_button(condition, element, button_text, suffix) {
      if (!suffix) {
            suffix = '';
      }
      if (condition) {
            element.html(button_text + ' ' + selection_size + ' ' + suffix);
            element.prop('disabled', false);
      } else {
            element.html(button_text + ' ' + suffix);
            element.prop('disabled', true);
      }
}

function update_buttons() {
      selection_size = $('li.selected').length;

      update_single_button(selection_size > 0, $('#delete-notes-button'), 'Delete')
      update_single_button(selection_size > 1, $('#merge-notes-button'), 'Merge')
      update_single_button(selection_size > 0, $('#unmerge-notes-button'), 'Unmerge')
      update_single_button(selection_size > 0, $('#deselect-notes-button'), 'Deselect')
      update_single_button(selection_size > 0, $('#sort_az-notes-button'), 'Sort', 'A &#8594; Z')
      update_single_button(selection_size > 0, $('#sort_za-notes-button'), 'Sort', 'Z &#8594; A')
      update_single_button(selection_size > 0, $('#sort_sl-notes-button'), 'Sort', 'Short &#8594; Long')
      update_single_button(selection_size > 0, $('#sort_ls-notes-button'), 'Sort', 'Long &#8594; Short')
      update_single_button(selection_size > 0, $('#number-notes-button'), 'Number')

      // if (selection_size > 1) {
      //       $('#merge-notes-button').text('Merge ' + selection_size);
      //       $('#merge-notes-button').prop('disabled', false);
      // } else {
      //       $('#merge-notes-button').text('Merge');
      //       $('#merge-notes-button').prop('disabled', true);
      // }
      //
      // if (selection_size > 0) {
      //       $('#unmerge-notes-button').text('Unmerge ' + selection_size);
      //       $('#unmerge-notes-button').prop('disabled', false);
      // } else {
      //       $('#unmerge-notes-button').text('Unmerge');
      //       $('#unmerge-notes-button').prop('disabled', true);
      // }
      //
      // if (selection_size > 0) {
      //       $('#deselect-notes-button').text('Deselect ' + selection_size);
      //       $('#deselect-notes-button').prop('disabled', false);
      // } else {
      //       $('#deselect-notes-button').text('Deselect');
      //       $('#deselect-notes-button').prop('disabled', true);
      // }
}

function add_note(content) {
      notes.push(content);
}

$('#add-note-field').keyup(function(event) {
      if (event.keyCode === 13) {
            var note_text = $('#add-note-field').val();
            console.log(note_text)
            add_note(note_text);
            $('#notes-panel').append(load_note(note_text));
            sync();
            $('#add-note-field').val('');
      }
});

// Delete selection
$('#delete-notes-button').click(() => {
      record_event({
            'type': 'delete',
            'items': $('li.list-group-item.selected')
      });
      $('li.list-group-item.selected').remove();
      update_buttons();
      write_to_text();
      sync();
});
// Merge multiple notes into one
$('#merge-notes-button').click(() => {
      selected = $('li.selected');
      record_event({
            'type': 'merge',
            'items': selected
      });

      for (var i = 1; i < selected.length; i++) {
            selected.get(0).innerText += "\n" + selected.get(i).innerText
            selected.get(i).remove()
      }

      update_buttons();
      sync();
});
// Unmerge (split by newline)
$('#unmerge-notes-button').click(() => {
      record_event({
            'type': 'unmerge',
            'items': $('li')
      });
      selection = $('li.selected');

      for (var i = 0; i < selection.length; i++) {
            replace_note_elements(
                  [selection[i]],
                  note_elements_to_array([selection[i]])[0].split('\n')
            );
      }

      update_buttons();
      sync();
});
// Select all
$('#select-notes-button').click(() => {
      record_event({
            'type': 'select',
            'items': $('li')
      });
      $('li').each((index) => Sortable.utils.select($('li')[index]))
      update_buttons();
      sync();
});
// Deselect all
$('#deselect-notes-button').click(() => {
      record_event({
            'type': 'deselect',
            'items': $('li')
      });
      $('li').each((index) => Sortable.utils.deselect($('li')[index]))
      update_buttons();
      sync();
});
// Alphabetical sort
$('#sort_az-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'sort_az',
            'items': selection
      });
      sorted_list = note_elements_to_array(selection).sort();
      replace_note_elements(selection, sorted_list);
      sync();
});
// Reverse alphabetical sort
$('#sort_za-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'sort_za',
            'items': selection
      });
      sorted_list = note_elements_to_array(selection).sort().reverse();
      replace_note_elements(selection, sorted_list);
      sync();
});
// Short to long sort
$('#sort_sl-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'sort_sl',
            'items': selection
      });
      sorted_list = note_elements_to_array(selection).sort((a, b) => a.length - b.length);
      replace_note_elements(selection, sorted_list);
      sync();
});
// Short to long sort
$('#sort_ls-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'sort_ls',
            'items': selection
      });
      sorted_list = note_elements_to_array(selection).sort((a, b) => a.length - b.length).reverse();
      replace_note_elements(selection, sorted_list);
      sync();
});
// Reverse alphabetical sort
$('#number-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'number',
            'items': selection
      });
      var list = note_elements_to_array(selection);
      for (var i = 0; i < list.length; i++) {
            list[i] = (i + 1) + '. ' + list[i];
      }
      replace_note_elements(selection, list);
      sync();
});

// Convert list of note elements to text field
function write_to_text() {
      $('#text-panel').val(note_elements_to_array($('li')).join('\n'));
      update_textarea();
      sync();
}

function update_textarea() {
      t = $('#text-panel')[0];
      // Adapted from https://stackoverflow.com/a/1430925
      t.style.height = "";
      t.style.height = t.scrollHeight + 3 + "px";
      sync();
}

// Create sortable instance for notes list
sortable = Sortable.create($('#notes-panel')[0], {
      multiDrag: true,
      selectedClass: "selected",
      animation: 150,
      onStart: function(evt) {
            record_event(evt);
            write_to_text();
            sync();
      },
      onSort: function(evt) {
            record_event(evt);
            write_to_text();
            sync();
      },
      onSelect: function(evt) {
            record_event(evt);
            write_to_text();
            update_buttons();
            sync();
      },
      onDeselect: function(evt) {
            record_event(evt);
            write_to_text();
            update_buttons();
            sync();
      }
});

// Create sortable instance for button list
button_sortable = Sortable.create($('#button-list')[0], {
      selectedClass: "selected",
      animation: 150,
});

// https://github.com/SortableJS/Sortable/issues/1612#issuecomment-526477250
// let deselectMultiDrag = sortable.multiDrag._deselectMultiDrag;
// document.removeEventListener('pointerup', deselectMultiDrag, false);
// document.removeEventListener('mouseup', deselectMultiDrag, false);
// document.removeEventListener('touchend', deselectMultiDrag, false);

// Stop event propagation so clicks in sidebar don't deselect notes
// https://github.com/SortableJS/Sortable/issues/1612#issuecomment-533777362
$('#sidebar').on('pointerup mouseup touchend', function(event) {
      event.stopPropagation();
});

$('.toast').toast({
      'delay': 10000
})

write_to_text();
update_buttons();
$(document).ready(update_textarea);
$('#text-panel').on('input', update_textarea);

$(function() {
      $('[data-toggle="tooltip"]').tooltip()
})
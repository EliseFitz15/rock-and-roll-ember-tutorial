import Ember from 'ember';
import { capitalize } from '../../../helpers/capitalize';

export default Ember.Controller.extend({
  songCreationStarted: false,
  title: '',
  sortBy: 'ratingDesc',
  sortProperties: Ember.computed('sortBy', function(){
    var options = {
      'ratingDesc': 'rating:desc,title:asc',
      'ratingAsc': 'rating:asc,title:asc',
      'titleDesc': 'title:desc',
      'titleAsc': 'title:asc',
    };
    return options[this.get('sortBy')].split(',');
  }),
  sortedSongs: Ember.computed.sort('matchingSongs', 'sortProperties'),
  searchTerm: '',
  queryParams: {
    sortBy: 'sort',
    searchTerm: 's',
  },
  isAddButtonDisabled: Ember.computed.empty('title'),
  hasSongs: Ember.computed.bool('model.songs.length'),
  canCreateSong: Ember.computed.or('songCreationStarted', 'hasSongs'),
  newSongPlaceholder: Ember.computed('model.name', function() {
    var bandName = this.get('model.name');
    return `New ${capitalize(bandName)} song`;
  }),
  matchingSongs: Ember.computed('model.songs.@each.title', 'searchTerm', function() {
    var searchTerm = this.get('searchTerm').toLowerCase();
    return this.get('model.songs').filter(function(song) {
      return song.get('title').toLowerCase().indexOf(searchTerm) !== -1;
    });
  }),

  actions: {
    setSorting(option) {
      this.set('sortBy', option);
    },
    enableSongCreation() {
      this.set('songCreationStarted', true);
    },
    updateRating(params) {
      let { item: song, rating } = params;
      if (song.get('rating') === rating) {
        rating = null;
      }
      song.set('rating', rating);
      return song.save();
    }
  }
});

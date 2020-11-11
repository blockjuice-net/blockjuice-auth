(function () {

  'use strict'

  // var socket = io();

  var dashboard_vue = new Vue({
    
    el: '#dashboard',

    data() {
      return { 
        headers: ['block', 'timestamp', 'producer', 'id', 'confirmed'],
        blocks: [],
        limit: 20,
        interval: 3000,
        lastBlock: 0,
        error: ''
      }
    },
    computed: {

      lastBlocks() {

        if (_.size(this.blocks) > this.limit) {
          return _.takeRight(this.blocks, this.limit)
        } else {
          return this.blocks;
        }

      }

    },

    methods: {
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
      }
    }
  });

  socket.on('error', (error) => {
    dashboard_vue.error = error;
  });

  /*
  function loadBlock () {
    console.log('emit socket client loadblock...');
    socket.emit('loadblock', dashboard_vue.lastBlock);
  };

  socket.on('block', (block) => {
    // if (typeof block.block_num != 'undefined' || block.block_num != '') {
      dashboard_vue.lastBlock = block.block_num;
      dashboard_vue.blocks.push(block);
    // };
  });

  loadBlock();

  var mSocket = setInterval(loadBlock, 3000);
  */


}())

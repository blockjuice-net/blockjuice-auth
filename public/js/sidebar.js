(function () {

    'use strict'
  
    var sidebar_data = [
      {
        name: 'Dashboard',
        key: 'dashboard',
        link: '/dashboard',
        current: true,
        home: true
      },
      {
        name: 'Accounts',
        key: 'accounts',
        link: '/dashboard/accounts',
        current: false,
        home: false
      },
      {
        name: 'IOT',
        key: 'iot',
        link: '/dashboard/iot',
        current: false,
        home: false
      }
    ];
  
    var sidebar_specials = [
      {
        name: 'COVID19',
        key: 'covid19',
        link: '/dashboard/covid19',
        current: false
      }
    ];
  
    Vue.component('sidebar', {
      data() {
        return { 
          items: sidebar_data,
          specials: sidebar_specials
        }
      }, 
      methods: {
        selectItem (item) {
          _.forEach(this.items, i => {
            i.current = (item.name == i.name ? true : false)
          });
        }
      }
    });
  
  }())
  
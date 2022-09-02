export const strict = false

export const state = () => ({
  detailPageName: '',
  naviMenu: null,
  presentMenu: '',
})

export const mutations = {
  setDetailPageName: (state, payload) => {
    state.detailPageName = payload
  },
  setNaviMenu: (state, payload) => {
    state.naviMenu = payload
  },
  setPresentMenu: (state, payload) => {
    state.presentMenu = payload
  },
}

export const getters = {
    isAuthenticated(state) {
      return state.auth.loggedIn
    },
  
    loggedInUser(state) {
      console.log(state)
      return state.auth.user      
    },

    getDetailPageName: (state) => state.detailPageName,
    getNaviMenu: (state) => state.naviMenu,
    getPresentMenu: (state) => state.presentMenu,    
}
export default function ({ $auth, $axios }) {
    // you can optionally change `to` by returning a new value
    $auth.onRedirect((to, from) => {
      if (from === '/login') {
        return $auth.$state.user.firstMenuUri
      }
  
      // 권한으로 인해 /login 화면으로 넘어갔을 경우
      // ex ) logout, refresh_token 만료
      if (to === '/login') {
        // logout으로 오지않고 만료로 왔을 경우
        if (!$auth.isLogouted) {
          try {
            if ($auth.logoutException) {
              // 어떤 이유로 logn페이지로 redirect 되었는지
              if ($auth.logoutException.message)
                alert($auth.logoutException.message)
            } else {
              // 특별한 이유 없으면 접속시간 만료
              alert('접속시간이 만료되었습니다.')
            }
          } catch (_e) {
            // ssr 에러 방지용
          } finally {
            $auth.logoutException = null
          }
        }
      }
    })
  }
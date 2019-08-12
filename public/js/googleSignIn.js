        function onSignIn(googleUser){
            let profile = googleUser.getBasicProfile();
             console.log(profile)
           
            $('.g-signin2').css('display','none');
            $('.data').css('display','block'); 
            // $('#email').text(profille.getEmai());
            // $('#id').text(profile.getId());
           
           
        }
        function signOut(){
            let auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function(){
                 $('.g-signin2').css('display','block');
                 $('.data').css('display','none'); 
                 alert('you have successfully registered')
            })
        }


      
    

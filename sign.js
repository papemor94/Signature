$(document).ready(function () {

var crypto = window.crypto ;


//** Exponentiation modulaire **//
function puissanceModulaire(g, e, n){
    x = 1n;
    while (e > 0n){
        if ((e & 1n) == 1n)
            x = (x * g) % n;
        g = (g ** 2n) % n;
        e = e >> 1n;

      }
    return x;
}
function inverse(A, p){
  u= A
  v=p
  X1 = 1n;
  X2=0n;
  while (u!=1n ){
    q = v/u ;
    R=v-q*u ; 
    X=X2-q*X1;
    v=u ;
    u=R ;
    X2=X1 ;
    X1=X ; 

  }
  if (X1%p<0){
    return X1%p + p ; 
  }
  else
  return X1%p ; 

} 



  function convertArrayBufferToHexa(buffer)
  {
      let i, len, hex = '', c;


      let data_view = new DataView(buffer);
      len = data_view.byteLength;
      for(i = 0; i < len; i++)
      {
          c = data_view.getUint8(i).toString(16);
          if(c.length < 2)
          {
              c = '0' + c;
          }

          hex += c;
      }

      return hex;
  }

  function ascii(lettre)
  {
    return lettre.charCodeAt(0);
  }

  function convertStringToByteArray(str)
  {
    return Uint8Array.from(str.split('').map(ascii)); //  donc ici la foncion ascii sera applique sur tout le array split
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
//Retourne un tableau array et un buffer de taille size remplit de valeurs aléatoires
function generate_rand_bigint(size){
  buffer = new ArrayBuffer(size);
  array= new Uint8Array(buffer);
  crypto.getRandomValues(array);
return [buffer,array] ;
}

  $(document).ready(function(){

    q="0x84824f140441643469b48068b8a4ed309b401797bbb3c0ee452e4bb316da6221";
    k="0x6807eb788ceafdc0d3866e5366880147313a689846995c5129a777339fed85df15850ff00b004cdfe044948e3f8dda46b9ba155e9801a2c4f315df68f3725e59e7aace2bc9d2183b384a54c27746514380abfad7334cd9bb2564591dae0c4f872ba6721206c5e32e383e11ca557a593000c54dc517183f3267ad7909a4370e3068af61bf6d03dce0dd681d88df4590e894db91c06fcce5bb7fd18b04908e8f909002caf1195c9f80b06e1da002a13a1ef23b9aae4aabb2f9511d9c1ebd2560eac1296bdf082f90dcf8964adfc3975c45e2c739ee71ef5b890fa1310e020d7453";
    p="0x6bb213249fc80af9c0040ff8d8deadf3ecfeefc65a3c8239687f21dd72e9488dfe7cf423d347ebeb42a1f16f8f90db9803c115f4c289c42b5b370be06add21754127e7281d14bf763fd7a825e825bbc0bc4d4ed8124c1248c4a288dab8e3f88c06147a5af53cc141f658005a012a5375014538a7a82329dc4d58b45f46f0925eec2eb0f85bf966c687d323ae71aa9a50f36c93ad920f3de524a16d09d5f970f13aeecebe1ef96f62fabb85f19ee145c95916ff9943e2f7264436a6b313bd9749c378de5b4018f5ce26146b24fc7a7c629ad0ab48ce1cc98fae600b61e6531b92027b50deeeddc24d4d8a78acc16c9d766d9a65177fc872ecb2207c2935e38967";

    var q=BigInt(q);
    var k=BigInt(k);
    var p=BigInt(p);




    //** choisir αlpha **//
    var rand_size=getRandomInt(256);
    var g=BigInt("0x"+convertArrayBufferToHexa(generate_rand_bigint(rand_size)[0]))%p;
    do{
      g=(g+1n)%p;
      alpha=puissanceModulaire(g, 2n*k, p);
    }
    while(puissanceModulaire(alpha,q,p)!=1);

    window['alpha']=alpha ; 


    //** calculer beta **//
    var rand_size=getRandomInt(32);
    var a=BigInt("0x"+convertArrayBufferToHexa(generate_rand_bigint(rand_size)[0]))%q;
  
    beta = puissanceModulaire(alpha, a, p);
    window['beta']=beta ; 


    //*** Générer une signature ***//   


     $("input[name=generate").click(function(){
       console.log(window['message_hash'] , 'test') ; 
             //choisir k
      var rand_size=getRandomInt(32);
      var k=BigInt("0x"+convertArrayBufferToHexa(generate_rand_bigint(rand_size)[0]))%q;
      k_inverse=inverse(k ,q);

        window['gamma']=puissanceModulaire(alpha, k, p)%q;
        window['delta']=((window['message_hash']+a*window['gamma'])*k_inverse)%q;
        console.log(window['delta'] , "window amma") ; 

          console.log(window['gamma']) ; 
          console.log(window['delta']) ; 

          /**********   Ecriture du resultat dans un fichier p, q, alpha , beta , delta, gamma */
          function download(filename, text1, text2, text3, text4, text5, text6) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text1)+'\n'+ encodeURIComponent(text2)+'\n'+ encodeURIComponent(text3)+'\n'+ encodeURIComponent(text4)+'\n'+ encodeURIComponent(text5)+'\n'+ encodeURIComponent(text6));
           
            element.setAttribute('download', filename);
          
            element.style.display = 'none';
            document.body.appendChild(element);
          
            element.click();
        
          }
var res   =""
download("sha256mdn.txt" , p, q ,alpha, beta, window['gamma'], window['delta']) ;

       });
      

     }) ; 

 //** Vérifier la Signature **//
 $("input[name='verify']").click(function(){

  console.log(window['delta1'] , "synchronisation verification") ; 
  var delta_inverse1=inverse(window['delta1'],window['q1']);
  console.log(delta_inverse1 , "delinverse")
  console.log(window['hash1'] , 'hash1') ; 
  e1=(window['hash1']*delta_inverse1)%window['q1'];
  e2=(window['gamma1']*delta_inverse1)%window['q1'];
  console.log(e1, "e1")
  console.log(e2, "e2")

  verify=(puissanceModulaire(window['alpha1'], e1, window['p1'])*puissanceModulaire(window['beta1'], e2, window['p1']))%window['p1']%window['q1'];
 if(verify==window['gamma1']){
   alert('votre signature est conforme') ; 
 }
 else{
    alert ("votre signature n'est pas conforme") ; 
 }
   
});

    
 });



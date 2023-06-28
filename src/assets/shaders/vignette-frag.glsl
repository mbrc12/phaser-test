precision mediump float;

uniform vec2      iResolution;

void main()
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
   
    uv *=  1.0 - uv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
    
    float vig = uv.x*uv.y * 100.0; // multiply with sth for intensity
    
    vig = pow(vig, 0.1); // change pow for modifying the extend of the  vignette

    
    gl_FragColor = vec4(vig); 
}

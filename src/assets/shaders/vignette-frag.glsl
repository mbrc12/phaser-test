precision mediump float;

uniform sampler2D uMainSampler;

uniform vec2      iResolution;

void main()
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec4 color = texture2D(uMainSampler, uv);
   
    uv *=  1.0 - uv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
    
    float vig = uv.x*uv.y * 30.0; // multiply with sth for intensity
    
    vig = pow(vig, 0.99); // change pow for modifying the extend of the  vignette

    gl_FragColor = vec4(vig) * color;
}

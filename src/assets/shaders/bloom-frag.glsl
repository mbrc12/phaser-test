
/**
------------ one pass bloom shader ------------

    author: Richman Stewart

    applies a gaussian blur horizontally and vertically
    and applies it on top of the original texture

------------------ use ------------------------

    bloom_size - defines the spread x and y
    bloom_intensity - bloom intensity

**/

in vec4 v_colour;
in vec2 tex_coord;
out vec4 pixel;

uniform sampler2D t0;
uniform float bloom_spread = 1;
uniform float bloom_intensity = 2;
void main() {
	ivec2 size = textureSize(t0, 0);

    float uv_x = tex_coord.x * size.x;
    float uv_y = tex_coord.y * size.y;

    vec4 sum = vec4(0.0);
    for (int n = 0; n < 9; ++n) {
        uv_y = (tex_coord.y * size.y) + (bloom_spread * float(n - 4));
        vec4 h_sum = vec4(0.0);
        h_sum += texelFetch(t0, ivec2(uv_x - (4.0 * bloom_spread), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x - (3.0 * bloom_spread), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x - (2.0 * bloom_spread), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x - bloom_spread, uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x, uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + bloom_spread, uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + (2.0 * bloom_spread), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + (3.0 * bloom_spread), uv_y), 0);
        h_sum += texelFetch(t0, ivec2(uv_x + (4.0 * bloom_spread), uv_y), 0);
        sum += h_sum / 9.0;
    }

    pixel = texture(t0, tex_coord) - ((sum / 9.0) * bloom_intensity);
}

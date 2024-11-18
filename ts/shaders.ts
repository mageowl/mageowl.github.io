import { el } from "./elements.js";

function assert<T>(value: T | null | undefined, msg: string): T {
    if (value == null) {
        throw msg;
    } else {
        return value;
    }
}
const gl = assert(
    el.shaderCanvas.getContext("webgl"),
    "Could not initialize WebGL.",
);

enum ShaderType {
    VERTEX = gl.VERTEX_SHADER,
    FRAGMENT = gl.FRAGMENT_SHADER,
}
interface Shader {
    path: string;
    type: ShaderType;
}

const shaderCache: { [path: string]: WebGLShader } = {};
async function compileShader(
    path: string,
    type: ShaderType,
): Promise<WebGLShader> {
    const code = await fetch("./" + path).then((res) => res.text());
    const shader = assert(gl.createShader(type), "Could not create shader.");

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(
            `Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`,
        );
        throw gl.getShaderInfoLog(shader);
    }

    shaderCache[path] = shader;
    return shader;
}

interface Program {
    program: WebGLProgram;
    uniformsMap: { [name: string]: WebGLUniformLocation };
    attributesMap: { [name: string]: WebGLUniformLocation };
}

async function buildProgram(
    shaderInfo: Shader[],
    uniforms: string[],
    attributes: string[],
): Promise<Program> {
    const program = assert(gl.createProgram(), "Could not create program.");

    await Promise.all(
        shaderInfo.map(async (desc) => {
            let shader =
                shaderCache[desc.path] ??
                (await compileShader(desc.path, desc.type));
            gl.attachShader(program, shader);
        }),
    );

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking shader parameter");
        throw gl.getProgramInfoLog(program);
    }

    const uniformsMap: { [name: string]: WebGLUniformLocation } = {};
    uniforms.forEach((name) => {
        uniformsMap[name] = assert(
            gl.getUniformLocation(program, name),
            `Could not find uniform ${name}.`,
        );
    });

    const attributesMap: { [name: string]: WebGLUniformLocation } = {};
    attributes.forEach((name) => {
        attributesMap[name] = assert(
            gl.getAttribLocation(program, name),
            `Could not find attribute ${name}.`,
        );
    });

    return { program, uniformsMap, attributesMap };
}

let program: Program | null;
let running = false;
const verticies = new Float32Array([
    -1, 1, 0, 0, 1, 1, 1, 0, -1, -1, 0, 1, 1, -1, 1, 1,
]);
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

export async function set(path: string) {
    if (program) gl.deleteProgram(program);

    program = await buildProgram(
        [
            {
                type: ShaderType.VERTEX,
                path: "./glsl/vertex.glsl",
            },
            {
                type: ShaderType.FRAGMENT,
                path,
            },
        ],
        [],
        ["aVertexPosition", "aTexturePosition"],
    );

    if (!running) draw();
}

function draw() {
    gl.viewport(0, 0, el.shaderCanvas.width, el.shaderCanvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const vertexPosition = assert(
        program?.attributesMap["aVertexPosition"],
        "Could not get vertex position attribute",
    ) as number;
    const texturePosition = assert(
        program?.attributesMap["aTexturePosition"],
        "Could not get texture position attribute",
    ) as number;

    gl.enableVertexAttribArray(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(texturePosition);
    gl.vertexAttribPointer(texturePosition, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

    gl.useProgram(assert(program?.program, "Shaders not initialized."));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(draw);
}

import generator from "generate-password";

export default function getPassword() {
    return generator.generate({
        length: 10,
        numbers: true
    });
}



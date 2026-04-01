var config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#eef4ff",
                    100: "#dfeafd",
                    500: "#155fa8",
                    600: "#0f4f91",
                    700: "#0b3f77"
                },
                accent: {
                    500: "#fecd1b",
                    600: "#e9bc13"
                }
            }
        }
    },
    plugins: []
};
export default config;

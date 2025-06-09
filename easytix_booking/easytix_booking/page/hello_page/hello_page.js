frappe.pages['hello-page'].on_page_load = function(wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Hello Page',
        single_column: true
    });

    $(page.body).html(`
        <h1>Hello from JS!</h1>
        <p>This content is set directly in JS.</p>
    `);
};
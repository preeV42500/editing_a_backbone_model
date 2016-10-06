var ProductModel = Backbone.Model.extend({
  setDatetime: function() {
    var date = new Date(this.get("date")),
        datetime = formatDatetime(date);
    this.set("datetime", datetime);
  },
  setDateFormatted: function() {
    var date = new Date(this.get("date")),
        date_formatted = formatDate(date);
    this.set("date_formatted", date_formatted);

  },
  initialize: function() {
    this.setDatetime();
    this.setDateFormatted();
  }
});

var product = new ProductModel(product_json); // create new product model using attributes from product_json object

var templates = {};
$("[type='text/x-handlebars']").each(function() { // store Handlebars templates on templates object
  var $template = $(this);
  templates[$template.attr("id")] = Handlebars.compile($template.html());
});

renderProduct();
renderForm();

$("form").on("submit", function(e) {
  e.preventDefault();
  var inputs = $(this).serializeArray(),
      date = new Date(),
      attrs = {};
  inputs.forEach(function(input) {
    attrs[input.name] = input.value; // set form input names and corresponding values on attrs object
  });
  // recalculate datetime and formatted date
  attrs.datetime = formatDatetime(date);
  attrs.date_formatted = formatDate(date);
  attrs.date = date.valueOf();

  product.set(attrs); // set updated attributes on model
  // render model to page
  renderProduct();
});

function formatDatetime(date) {
  // returns string of format year-month-dayThours:minutes:seconds, e.g. 2015-05-01T10:30:24
  var datetime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  datetime += "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return datetime;
}

function formatDate(date) {
  // returns string formatted such as May 1st, 2015 10:30:24
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      suffix_overrides = ["st", "nd", "rd"],
      date_suffix = "th",
      date_formatted;

  if ((date.getDate() % 10) > 0 && (date.getDate() % 10) <= suffix_overrides.length) {
    date_suffix = suffix_overrides[(date.getDate() % 10) - 1];
  }

  date_formatted = months[date.getMonth()] + " " + date.getDate() + date_suffix + ", " + date.getFullYear();
  date_formatted += " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return date_formatted;
}

function renderProduct() { // write the product model to the page
  $("article").html(templates.product(product.toJSON()));
}

function renderForm() { // write the form contents to the page, pre-populated with the model's attributes
  $("fieldset").html(templates.form(product.toJSON()));
}

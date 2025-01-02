# KU65 Generator

This repo is a small website to be run locally, it takes transaction data and generates the KU65 xml form for submission to the Swedish Tax Agency.

## Preamble

The xml form this program generates is derived from the `data/templateBase.xml` file. The program takes this file and will replace all template strings `{ example.template.string }` and replaces with their corresponding values. The types of values available to inject into the base template are:

* `config` – variables from `data/config.csv`, e.g. `{ config.year }`
* `createdAt` – the time of program execution.
* `content` – here the `data/templateContent.xml` xml will be repeated for every entry in `data/entries.csv`.

The `data/tempalteContent.xml` then has access to the same template strings as the base template but with the added data from entries.csv – defined by the csv header, i.e. if the header has `banana, pear, apple`, then `{ banana }`, `{ pear }` and `{ apple }` will be available template strings for each entry defined by the content template.

It's quite dynamic in that sense – and can easily be expanded upon.


## Instructions

1. Copy `data/config.template.csv` to `date/config.csv` and enter your details.
2. Create a `data/entries.csv` file according to the specifications of `data/entries.template.csv` – here you will declare all the transaction to be submitted. Multiple transactions for one individual will be summed to a single entry.
3. Review `data/templateBase.xml` and `data/templateContent.xml` to make sure they are up to date with the current years KU65 specifications.
4. Open `index.html` in your browser and upload your `.csv` and the two `.xml` files, the generator will then download the KU65 form for you.
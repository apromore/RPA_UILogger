/*
 * Copyright © 2019 The University of Melbourne.
 *
 * This file is part of "Apromore".
 *
 * "Apromore" is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * "Apromore" is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 */
 
 
document.addEventListener('DOMContentLoaded', function () {
    console.log("started: " + $("#record").prop("checked"))

    // var storage = JSON.parse(localStorage.getItem('checkboxValue') || {});
    var storage = (localStorage.getItem('checkboxValue') || {}) == 'true';



    console.log("storage:" + storage);

    if (storage === true ){
        $("#record").prop("checked",true);
        console.log("was true "+$("#record").prop("checked")); 
    } else{
        console.log("was false "+$("#record").prop("checked")); 
        $("#record").prop("checked",false);
    }

    // $("#record").prop("checked", true);

    $("#record").on("change", function () {
        value = this.checked;
        console.log("clicked " + value)
        localStorage.setItem('checkboxValue', value);
        console.log("storage updated: "+localStorage.getItem('checkboxValue'));
        //alert("Hello! I am an alert box!!");
    });



});









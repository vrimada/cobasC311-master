"use strict";
// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but 
//                 backwards-compatability was required.
// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------
let MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
let DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
function LZ(x) {
    return ((x < 0 || x > 9) ? "" : "0") + x;
}
// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------
/*function isDate(val : string, format : string) {
    let date : Date = getDateFromFormat(val,format);
    if (date == null) {
         return false;
        }
    return true;
}*/
// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 of if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------
/*function compareDates(date1 : string, dateformat1 : string, date2 : string, dateformat2 : string) : number {
    let d1 : Date = getDateFromFormat(date1,dateformat1);
    let d2 : Date = getDateFromFormat(date2,dateformat2);
    if (d1 == null || d2 == null) {
        return -1;
    }
    else if (d1 > d2) {
        return 1;
    }
    return 0;
}*/
// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in getDateFromFormat()
// ------------------------------------------------------------------
function formatDate(date, format) {
    let result = "";
    let y = date.getFullYear();
    let M = date.getMonth() + 1;
    let d = date.getDate();
    let H = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    result = [y, LZ(M), LZ(d), LZ(H), LZ(m), LZ(s)].join('');
    /*
    // Convert real date parts into formatted versions
    format = format + ""; //yyyyMMddHHmmss
    let value : Object = new Object();value["y"] = y;
    let token : string = "";
    let i_format : number = 0;
    let c : string = "";
    value["yyyy"] = y;
    value["yy"] = y % 100;
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M-1];
    value["NNN"] = MONTH_NAMES[M+11];
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E+7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);

    if (H == 0){
        value["h"] = 12;
    }
    else if (H > 12){
        value["h"] = H - 12;
    }
    else {
        value["h"] = H;
    }

    value["hh"] = LZ(value["h"]);

    if (H > 11){
        value["K"] = H - 2;
    } else {
        value["K"] = H;
    }

    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);

    if (H > 11) {
        value["a"] = "PM";
     }
    else {
        value["a"] = "AM";
    }

    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);



    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) {
             result = result + value[token];
            }
        else {
             result = result + token;
           }
    }*/
    return result;
}
// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
    let digits = "1234567890";
    for (let i = 0; i < val.length; i++) {
        if (digits.indexOf(val.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}
/*function _getInt(str : string, i : number, minlength : number, maxlength : number) : number{
    for (let x = maxlength; x >= minlength; x--) {
        let token  = str.substring(i, i+x);

        if (_isInteger(token)) {
            return parseInt(token);
        }
        if (token.length < minlength) {
            return null;
        }
        
    }
    return null;
}*/
// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
/*function getDateFromFormat(val : string, format : string) : Date {
    val = val + "";
    format = format + "";
    let i_val : number = 0;
    let i_format : number = 0;
    let c : string	= "";
    let token : string = "";
    let x : number = 0 , y : number = 0;
    let now = new Date();
    let year : number = now.getFullYear();
    let month : number = now.getMonth()+1;
    let date : number = 1;
    let hh : number = now.getHours();
    let mm : number = now.getMinutes();
    let ss : number = now.getSeconds();
    let ampm : string = "";
    let newDate : Date = new Date(1900,1,1);

    while (i_format < format.length) {
        // Get next token from format string
        c = format.charAt(i_format);
        token="";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        
        switch(token){
            case "yyyy": case "yy" : case "y":
            {
                if (token=="yyyy") { x=4;y=4; }
                if (token=="yy")   { x=2;y=2; }
                if (token=="y")    { x=2;y=4; }
    
                year = _getInt(val,i_val,x,y);
                if (year == null) { return newDate; }
    
                i_val += year.toString().length;
    
                if (year.toString().length == 2) {
                    if (year > 70) { year = 1900 + (year - 0); }
                    else { year=2000+(year-0); }
                    }

            }
             break;

            case "MMM"  : case "NNN" :
                {
                    month = 0;
                    for (let i=0; i<MONTH_NAMES.length; i++) {
                        let month_name = MONTH_NAMES[i];
                        if (val.substring(i_val,i_val+month_name.length).toLowerCase() == month_name.toLowerCase()) {
                            if (token == "MMM" || (token == "NNN" && i>11)) {
                                month = i+1;
                                if (month>12) { month -= 12; }
                                i_val += month_name.length;
                                break;
                                }
                            }
                        }
                    if ((month < 1)||(month>12)){	return newDate;	}
                }
                break;

            case "EE" :  case "E":
            {
                for (let i=0; i<DAY_NAMES.length; i++) {
                    let day_name=DAY_NAMES[i];
                    if (val.substring(i_val,i_val+day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                        }
                    }
            }
            break;
        
            case "MM" : case "M" :
            {
                month = _getInt(val,i_val,token.length,2);
                if(month == null || (month<1) || (month>12)){
                        return newDate;
                    }
                i_val += month.toString().length;
            }
            break;
        
            case "dd" : case "d" :
            {
                date = _getInt(val,i_val,token.length,2);
                if(date==null||(date<1)||(date>31)){
                        return newDate;
                    }
                i_val += date.toString().length;
            }
            break;

            case "hh" : case "h" :
            {
                hh = _getInt(val,i_val,token.length,2);
                if(hh == null || (hh<1) || (hh>12)){
                        return newDate;
                    }
                i_val+=hh.toString().length;
            }
                break;

            case "HH" : case "H"	:
            {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>23)){
                        return newDate;
                    }
                i_val+=hh.toString().length;
            }
                break;

            case "KK" : case "K" :
            {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>11)){	return newDate;}
                i_val+=hh.toString().length;
            }
            break;

            case "kk" : case "k" :
            {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<1)||(hh>24)){	return newDate;}
                i_val+=hh.toString().length;hh--;
            }
            break;

            case "mm" : case "m":
            {
                mm=_getInt(val,i_val,token.length,2);
                if(mm==null||(mm<0)||(mm>59)){	return newDate;}
                i_val+=mm.toString().length;
            }
            break;
            
            case "ss" : case "s":
            {
                ss=_getInt(val,i_val,token.length,2);
                if(ss==null||(ss<0)||(ss>59)){	return newDate;}
                i_val+=ss.toString().length;
            }
            break;
        
            case "a" : {
                if (val.substring(i_val,i_val+2).toLowerCase()=="am") {
                    ampm="AM";
                }
                else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {
                    ampm="PM";
                }
                else {
                    return newDate;
                }
                i_val+=2;
            }
            break;

            default :
                if (val.substring(i_val,i_val+token.length)!=token) {
                    return newDate;
                }
                else {
                    i_val+=token.length;
                }
            break;
        }
    }

    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) {
         return newDate;
    }
    // Is date valid for month?
    if (month==2) {
        // Check for leap year
        if ( ( (year % 4 == 0) && (year % 100 != 0) ) || (year % 400 == 0) ) { // leap year
            if (date > 29){
                return newDate;
            }
        }
        else {
            if (date > 28) {
                return newDate;
            }
        }
        }
    if ((month==4) || (month==6) || (month==9) || (month==11)) {
        if (date > 30) {
            return newDate;
        }
    }
    // Correct hours value
    if (hh<12 && ampm == "PM") {
         hh = hh-0+12;
        }
    else if (hh>11 && ampm=="AM") {
         hh-=12;
    }

    newDate = new Date(year,month-1,date,hh,mm,ss);
    return newDate;
}*/
// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------
/*function parseDate(val : string) : Date {
    let preferEuro = (arguments.length==2) ? arguments[1] : false;
    let generalFormats = new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');
    let monthFirst = new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
    let dateFirst = new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
    let checkList = new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
    let d = null;

    for (let i=0; i<checkList.length; i++) {
        let l = window[checkList[i]];
        for (let j=0; j<l.length; j++) {
            d = getDateFromFormat(val,l[j]);
            if (d!=0) {
                return new Date(d);
            }
        }
    }
    return null;
}*/

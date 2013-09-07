/*
 * Copyright 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This class defines attributes, valid values, and usage which is generated from
 * a given json schema. http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5
 *
 * @author Chirag Shah <chirags@google.com>
 *
 */
var Google_Model 	=	function(/*	polymorphic	*/){
	/**
	 * Initialize this object's properties from an array.
	 *
	 * @param array $array Used to seed this object's properties.
	 * @return void
	 */
	this.mapTypes	=	function(array){
		for(var key in array){
			this[key]	=	array[key];

			var 
				keyTypeName = "__"+key+"Type",
				keyDataType = "__"+key+"DataType";
			/* js always object, FTW: 

			if ($this->useObjects() && property_exists($this, $keyTypeName)) {
				if ($this->isAssociativeArray($val)) {
					if (isset($this->$keyDataType) && 'map' == $this->$keyDataType) {
						foreach($val as $arrayKey => $arrayItem) {
							$val[$arrayKey] = $this->createObjectFromName($keyTypeName, $arrayItem);
						}
						$this->$key = $val;
					} else {
						$this->$key = $this->createObjectFromName($keyTypeName, $val);
					}
				} else if (is_array($val)) {
					$arrayObject = array();
					foreach ($val as $arrayIndex => $arrayItem) {
						$arrayObject[$arrayIndex] = $this->createObjectFromName($keyTypeName, $arrayItem);
					}
					$this->$key = $arrayObject;
				}
			}
			*/
			}
		}

			// Initialize the model with the arguments
	this.mapTypes(arguments);
};

Google_Model.prototype	=	this;

module.exports		=	Google_Model;

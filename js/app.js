Array.prototype.current = 0;
Array.prototype.next = function() {
	this.current++;

	if (!((this.current + 1) in this)) {
		this.current = 0;
	}
	
	return this[this.current];
};

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var A = [ 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 ],
	R = [ "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I" ],
	Alength = A.length;
 
function romanichel(nb) {
	var x = parseInt(nb, 10) || 1,
		str = "";
 
	if (x < 1) {
		x = 1;
	} else if (x > 3999){
		x = 3999;
	}
 
	for (var i = 0; i < Alength; ++i) {
		while (x >= A[i]) {
			x -= A[i];
			str += R[i];
		}
 
		if (x == 0) {
			break;
		}
	}
	return str + '&#8194;<i class="fa fa-usd"></i><i class="fa fa-usd"></i>';
}

// //////////
// ----------
// //////////

function playOne(sounds, s, mute) {
	for (var i = 0; i < sounds.length; i++) {
		var thisTime = new Date();

		if (sounds[i]['finished'] < thisTime.getTime()) {
			sounds[i]['finished'] = thisTime.getTime() + document.getElementById(s).duration * 1000;
			sounds[i]['channel'].src = document.getElementById(s).src;
			sounds[i]['channel'].load();
			
			if (mute == true) {
				sounds[i]['channel'].volume = 0;
			}
			
			sounds[i]['channel'].play();
			break;
		}
	}
}

function switchSound(sounds, i) {
	if (sounds[i]['channel'].volume < 1) {
		sounds[i]['channel'].volume = 1
		return true;
	} else {
		sounds[i]['channel'].volume = 0
		return false;
	}
}

function play(sounds) {
	playOne(sounds, 'sound1', false);
	playOne(sounds, 'sound2', true);
	playOne(sounds, 'sound3', true);
	playOne(sounds, 'sound4', true);
	playOne(sounds, 'sound5', true);
	playOne(sounds, 'sound6', true);
	playOne(sounds, 'sound7', true);

	setTimeout(function() {
		for (var i = 0; i < sounds.length; i++) {
			sounds[i]['channel'].volume = 1;
		}
	}, 9800);
}

// //////////
// ----------
// //////////

jQuery(document).ready(function($) {
	// SOUND
	var sounds = new Array();
	
	for (i = 0; i < 7; i++) {
		sounds[i] = new Array();
		sounds[i]['channel'] = new Audio();
		sounds[i]['channel'].loop = true;
		sounds[i]['finished'] = -1;
	}

	var counter = 0;
	var soldierW = 80;
	var jump = 20;
	var cursor = 0;
	var points = 0;
	
	var mframe = $('.map .main-frame');
	var tframe = $('.map .top-frame');
	var pointBox = $('.points');

	var pattern = [
		'flag',
		'drummer',
		'standard',
		'standard',
		'standard',
		'flutist',
		'standard',
		'standard',
		'standard',
		'standard'
	];

	// 1000ms : rien
	// 3000ms : titre
	setTimeout(function() {
		$('.title')
		.css({
			'opacity': '0',
			'display': 'block'
		}).animate({
			'opacity': '1',
		}, 2000);
	}, 1000);

	// 7000ms : background
	setTimeout(function() {
		$('.map .background')
		.css({
			'opacity': '0',
			'display': 'block'
		}).animate({
			'opacity': '1',
		}, 2000);
	}, 4000);

	// 8000ms : demarrage du son
	setTimeout(function() {
		play(sounds);
	}, 8000);

	// XXXXms : démarrage du jeu
	setTimeout(function() {
		// affichage 
		$('.map .foreground').show(0);

		// affichage des soldats
		setInterval(function() {
			cursor += jump;
			
			$('.map .main-frame .soldier').each(function() {
				var soldier = $(this);
				var right   = parseInt(soldier.css('right'));
				var left    = parseInt(soldier.css('left'));

				// remove old soldier
				if (left <= 0) {
					soldier.remove();
					tframe.children('#h' + soldier.attr('id').substring(1)).remove();
				}

				// animation
				if (soldier.hasClass('n1') || soldier.hasClass('n2')) {
					soldier
						.toggleClass('n1')
						.toggleClass('n2');
				} else {
					soldier
						.toggleClass('d1')
						.toggleClass('d2');
				}

				soldier.css('right', right + jump);
				tframe.children('#h' + soldier.attr('id').substring(1)).css('right', right + jump);
			});

			// create new soldier
			if (cursor >= soldierW) {
				mframe.append('<div class="soldier ' + pattern[pattern.current] + ' n1" id="s' + counter + '" style="right: -' + soldierW + 'px"></div>');
				tframe.append('<div class="hitbox" id="h' + counter + '"></div>');
				
				pattern.next();
				counter++;
				cursor = 0;
			}
		}, 610);
	}, 14930);

	// 20000ms : affichage du score/sound
	setTimeout(function() {
		$('.points, .sounds')
		.css({
			'opacity': '0',
			'display': 'block'
		}).animate({
			'opacity': '1',
		}, 1000);
	}, 14930);

	$(document).on('click', '.hitbox', function(e) {
		var hasPoint = false;
		var soldier = mframe.children('#s' + $(this).attr('id').substring(1));

		if (soldier.hasClass('n1')) {
			hasPoint = true;
			soldier.removeClass('n1')
				.addClass('d1');
		} else if (soldier.hasClass('n2')) {
			hasPoint = true;
			soldier.removeClass('n2')
				.addClass('d2');
		}

		if (hasPoint) {
			points += rand(-10, 20);
			pointBox.html(romanichel(points));
		}
	});

	var cursorSound = new Audio('sounds/chainsaw.ogg');
	$('.top-frame').on('click', function() {
		cursorSound.currentTime = 0;
		cursorSound.play();
	});

	$('.sounds a').on('click', function() {
		var soundId = $(this).data('sound');
		switchSound(sounds, soundId);
		$(this).toggleClass('disabled');
	});
});

  (define-data-var meal-cost int 0)
  (define-data-var tip int 0)
  (define-data-var rating int 0)

  (define-public (reserve-meal-cost (cost int))
    (ok 
      (begin 
        (var-set meal-cost cost)
        (calculate-tip)
        (var-get meal-cost))))

  (define-public (get-meal-cost) 
    (ok (var-get meal-cost)))

  (define-public (get-tip-value)
    (ok (var-get tip)))
  (define-public (get-rating)
    (ok (var-get rating)))

  (define-public (finish-meal (mealRating int))
    (ok
      (begin 
        (var-set rating mealRating)
        (calculate-tip)
        (var-get rating))))

  ;; if rating is greater than 3 then the user is very satisfied
  ;; if rating is less than or equals 3 then the user is dissatisfied
  ;; tip would be the minimum 15%
  ;; tip would be 20%
  ;; Support these workers they are literally putting their lives on the line
  ;; if you'd like to support organizations helping in the corona effort
  ;; help people get food through https://www.cityharvest.org/
  ;; I hope this doesn't disqualify me xD
  (define-private (calculate-tip)
    (begin 
      (if
        (> (var-get rating) 3)
        (var-set tip (/ (* (var-get meal-cost) 20) 100))
        (var-set tip (/ (* (var-get meal-cost) 15) 100))
        )))